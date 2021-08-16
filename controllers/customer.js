const encryptPassword = require('../utils/encryptPassword');

const customerGet = async (req, res) => {
    try {
        const Customer = req.app.get('models').Customer;
        const CustomerList = await Customer.find().populate('user');

        if (!CustomerList) {
            return res.json({
                status: false,
                message: 'No customers found',
            });
        }

        res.json(CustomerList);
    } catch (error) {
        return res.json(error.message);
    }
}

const customerCreate = async (req, res) => {
    if (!req.body.password) {
        return res.json({
            status: false,
            message: 'No password provided',
        });
    }


    if (req.role !== 'manager') {
        return res.json('unauthorized')
    }

    try {
        const { token, salt, hash } = encryptPassword(req.body.password);

        const models = req.app.get('models');
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
}

const customerUpdate = async (req, res) => {
    if (req.role !== 'manager') {
        return res.json('unauthorized')
    }

    if (!req.body._id) {
        return res.json({
            status: false,
            message: 'No _id provided',
        });
    }

    try {
        if (!req.body._id || !req.body.toModifyCustomer) {
            return res.json({
                status: false,
                message: 'No id provided or no data user provided',
            });
        }

        const Customer = req.app.get('models').Customer;
        const toModifyCustomer = await Customer.findById(req.body._id);

        if (!toModifyCustomer) {
            return res.json({
                status: false,
                message: 'No customer found',
            });
        }

        const toModifyKeys = Object.keys(req.body.toModifyCustomer);
        for (const key of toModifyKeys) {
            toModifyCustomer[key] = req.body.toModifyCustomer[key];
        }
        await toModifyCustomer.save();
        res.json('Successfully Updated');
    } catch (error) {
        return res.json(error.message);
    }
}

const customerDelete = async (req, res) => {
    if (!req.body._id) {
        return res.json({
            status: false,
            message: 'No _id provided',
        });
    }

    if (req.role !== 'manager') {
        return res.json('unauthorized')
    }

    try {
        const Customer = req.app.get('models').Customer;
        const toDeleteCustomer = await Customer.findById(req.body._id);

        if (!toDeleteCustomer) {
            return res.json({
                status: false,
                message: 'No customer found',
            });
        }

        const toDeleteUser = await models.User.findById(toDeleteCustomer.user);

        await toDeleteUser.remove();
        await toDeleteCustomer.remove();
        res.json('Successfully Deleted');
    } catch (error) {
        return res.json(error.message);
    }
}

module.exports = { customerGet, customerCreate, customerUpdate, customerDelete };