// READ
const subscriptionGet = async (req, res) => {
    try {
        const Subscription = req.app.get("models").Subscription;
        const subscription = await Subscription.find();
        res.json(subscription);
    } catch (error) {
        res.json(error.message);
    }
};

// CREATE
const subscriptionCreate = async (req, res) => {
    if (req.role !== "manager") {
        return res.json({
            status: false,
            message: "unauthorized",
        });
    }

    if (!req.body) {
        return res.json({
            status: false,
            message: "missing request body",
        });
    }

    try {
        const models = req.app.get("models");
        const newSubscription = await new models.Subscription({
            beginningDate: req.body.beginningDate,
            endDate: req.body.endDate,
            paymentMethod: req.body.paymentMethod,
            amountPaid: req.body.amountPaid,
            customer: req.body.customer,
        }).save();

        const customer = await models.Customer.findById(req.body.customer);
        customer.subscriptions.push(newSubscription);
        await customer.save();

        res.json(newSubscription);
    } catch (error) {
        res.json(error.message);
    }
};

// UPDATE
const subscriptionUpdate = async (req, res) => {
    if (req.role !== "manager") {
        return res.json({
            status: false,
            message: "unauthorized",
        });
    }

    if (!req.body._id) {
        return res.json({
            status: false,
            message: "No _id provided",
        });
    }

    try {
        const Subscription = await req.app.get("models").Subscription;
        const toMofifySubscription = await Subscription.findById(req.body._id);

        if (!toMofifySubscription) {
            return res.json({
                status: false,
                message: "No subscription found",
            });
        }

        const toModifyKeys = Object.keys(req.body.toModify);
        for (const key of toModifyKeys) {
            toModifySubscription[key] = req.body.toModify[key];
        }
        await toModifySubscription.save();
    } catch (error) {
        return res.json(error.message);
    }
};

// DELETE
const subscriptionDelete = async (req, res) => {
    if (req.role !== "manager") {
        return res.json({
            status: false,
            message: "unauthorized",
        });
    }

    if (!req.body._id) {
        return res.json({
            status: false,
            message: "No _id provided",
        });
    }

    try {
        const Subscription = await req.app.get("models").Subscription;
        const toDeleteSubscription = await Subscription.findById(req.body._id);

        if (!toDeleteSubscription) {
            return res.json({
                status: false,
                message: "No subscription found",
            });
        }

        const customer = await req.app
            .get("models")
            .Customer.findById(toDeleteSubscription.customer);
        const index = customer.subscriptions.indexOf(toDeleteSubscription._id);

        customer.subscriptions.splice(index, 1);

        await customer.save();
        await toDeleteSubscription.remove();
    } catch (error) {
        return res.json(error.message);
    }
};

module.exports = {
    subscriptionGet,
    subscriptionCreate,
    subscriptionUpdate,
    subscriptionDelete,
};
