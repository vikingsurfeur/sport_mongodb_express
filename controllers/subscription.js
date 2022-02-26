// READ
const subscriptionGet = async (req, res) => {
    try {
        const Subscription = req.app.get("models").Subscription;
        const Subscriptions = await Subscription.find()
            .populate("customers");
        
        !Subscriptions &&
            res.json({
                status: false,
                message: "No subscriptions found",
            });

        res.json(Subscriptions);
    } catch (error) {
        res.json(error.message);
    }
};

// CREATE
const subscriptionCreate = async (req, res) => {
    !req.body.role === "manager" &&
        res.json({
            status: false,
            message: "unauthorized",
        });

    !req.body &&
        res.json({
            status: false,
            message: "missing request body",
        });

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

// DELETE
const subscriptionDelete = async (req, res) => {
    !req.body.role === "manager" &&
        res.json({
            status: false,
            message: "unauthorized",
        });

    !req.body._id &&
        res.json({
            status: false,
            message: "No _id provided",
        });

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

        res.json({
            status: true,
            message: "Subscription deleted",
        })
    } catch (error) {
        return res.json(error.message);
    }
};

// UPDATE
const subscriptionUpdate = async (req, res) => {
    !req.body.role === "manager" &&
        res.json({
            status: false,
            message: "unauthorized",
        });

    !req.body._id &&
        res.json({
            status: false,
            message: "No _id provided",
        });

    try {
        if (!req.body._id || !req.body.toModify) {
            return res.json({
                status: false,
                message: "No id provided or no data user provided",
            });
        }

        !req.body.role === "manager" &&
            res.json({
                status: false,
                message: "unauthorized",
            });

        const Subscription = await req.app.get("models").Subscription;
        const ToModifySubscription = await Subscription.findById(req.body._id);
        const toModifyKeys = Object.keys(req.body.toModify);

        if (!ToModifySubscription) {
            return res.json({
                status: false,
                message: "No subscription found",
            });
        }

        for (const key of toModifyKeys) {
            ToModifySubscription[key] = req.body.toModify[key];
        }

        await ToModifySubscription.save();

        res.json({
            status: true,
            message: "Subscription updated",
        })
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
