const encryptPassword = require("../utils/encryptPassword");

// READ
const customerGet = async (req, res) => {
    try {
        const Customer = req.app.get("models").Customer;
        const CustomerList = await Customer.find()
            .populate("user")
            .populate("subscriptions");

        !CustomerList &&
            res.json({
                status: false,
                message: "No customers found",
            });

        res.json(CustomerList);
    } catch (error) {
        return res.json(error.message);
    }
};

// CREATE
const customerCreate = async (req, res) => {
    !req.body.password &&
        res.json({
            status: false,
            message: "No password provided",
        });

    req.body.role !== "manager" && 
        res.json({
            status: false,
            message: "unauthorized"
        });
        
    try {
        const { token, salt, hash } = encryptPassword(req.body.password);
        const models = req.app.get("models");

        const NewUser = await new models.User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            email: req.body.email,
            token: token,
            salt: salt,
            hash: hash,
        }).save();

        const newCustomer = await new models.Customer({
            user: NewUser._id,
        }).save();

        res.json(newCustomer);
    } catch (error) {
        return res.json(error.message);
    }
};

// DELETE
const customerDelete = async (req, res) => {
    !req.body._id &&
        res.json({
            status: false,
            message: "No _id provided",
        });

    req.body.role !== "manager" && 
        res.json({
            status: false,
            message: "unauthorized"
        });

    try {
        const Customer = req.app.get("models").Customer;
        const ToDeleteCustomer = await Customer.findById(req.body._id);
        const models = req.app.get("models");

        !ToDeleteCustomer &&
            res.json({
                status: false,
                message: "No customer found",
            });

        const ToDeleteUser = await models.User.findById(ToDeleteCustomer.user);

        await ToDeleteUser.remove();
        await ToDeleteCustomer.remove();

        res.json({
            status: true,
            message: "Successfully Deleted"
        });
    } catch (error) {
        return res.json(error.message);
    }
};

// UPDATE
const customerUpdate = async (req, res) => {
    !req.body._id &&
        res.json({
            status: false,
            message: "No _id provided",
        });

    req.body.role !== "manager" && 
        res.json({
            status: false,
            message: "unauthorized"
        });

    try {
        if (!req.body._id || !req.body.toModify) {
            return res.json({
                status: false,
                message: "No id provided or no data user provided",
            });
        }

        const Customer = req.app.get("models").Customer;
        const ToModifyCustomer = await Customer.findById(req.body._id);
        const toModifyKeys = Object.keys(req.body.toModify);

        !ToModifyCustomer &&
            res.json({
                status: false,
                message: "No customer found",
            });

        for (const key of toModifyKeys) {
            ToModifyCustomer[key] = req.body.toModify[key];
        }

        await ToModifyCustomer.save();

        res.json({
            status: true,
            message: "Successfully Updated"
        });
    } catch (error) {
        return res.json(error.message);
    }
};

module.exports = {
    customerGet,
    customerCreate,
    customerUpdate,
    customerDelete,
};
