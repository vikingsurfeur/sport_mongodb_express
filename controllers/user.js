const encryptPassword = require('../utils/encryptPassword');
const decryptPassword = require('../utils/decryptPassword');

// GET
const userGet = async (req, res) => {
    try {
        const User = req.app.get('models').User;
        const MyUsers = await User.find();
        res.json(MyUsers);
    } catch (error) {
        res.json(error.message);
        console.error(`Something get Wrong: \n${error.message}`);
    }
};

// CREATE
const userCreate = async (req, res) => {
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

        const User = req.app.get('models').User;
        const NewUser = await new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            email: req.body.email,
            token, 
            salt, 
            hash,
        }).save();

        // if (NewUser) {
        //     res.json({
        //         status: true,
        //         message: 'Successfully created',
        //     });
            
        //     const UserExist = await User.findOne({ email: req.body.email });
        //     if (!UserExist) {
        //         const NewUserExist = await new User({
        //             firstName: req.body.firstName,
        //             lastName: req.body.lastName,
        //             dateOfBirth: req.body.dateOfBirth,
        //             email: req.body.email,
        //             token, 
        //             salt, 
        //             hash,
        //         }).save();
        //     } else {
        //         res.json({
        //             status: false,
        //             message: 'User already exist',
        //         });
        //     }
        // }
        res.json(NewUser);
    } catch (error) {
        return res.json(error.message);
    }
};

//DELETE
const userDelete = async (req, res) => {
    if (!req.body._id) {
        return res.json({
            status: false,
            message: 'No id provided',
        });
    }

    if (req.role !== 'manager') {
        return res.json('unauthorized')
    }

    try {
        const User = req.app.get('models').User;
        const ToDeleteUser = await User.findById(req.body._id);

        if (!ToDeleteUser) {
            return res.json({
                status: false,
                message: 'User not found',
            });
        }

        await ToDeleteUser.remove();

        res.json('Successfully Deleted');
    } catch (error) {
        return res.json(error.message);
    }
};

// UPDATE
const userUpdate = async (req, res) => {
    if (!req.body._id || !req.body.toModifyUser) {
        return res.json({
            status: false,
            message: 'No id provided or no data user provided',
        });
    }

    if (req.role !== 'manager') {
        return res.json('unauthorized')
    }

    try {
        const User = req.app.get('models').User;
        const toModifyUser = await User.findById(req.body._id);

        if (!toModifyUser) {
            return res.json({
                status: false,
                message: 'No user found',
            });
        }

        const toModifyKeys = Object.keys(req.body.toModifyUser);
        for (const key of toModifyKeys) {
            toModifyUser[key] = req.body.toModifyUser[key];
        }

        await toModifyUser.save();
        
        res.json('Successfully Updated');
    } catch (error) {
        return res.json(error.message);
    }
};

// LOGIN
const userLogin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.json({
            status: false,
            message: 'No email or password provided',
        });
    }

    try {
        const User = req.app.get('models').User;
        const ToVerifyUser = await User.findOne({
            email: req.body.email,
        });
        if (!ToVerifyUser) {
            return res.json({
                status: false,
                message: 'User not found',
            });
        }
        res.json(decryptPassword(ToVerifyUser, req.body.password));
    }
    catch (error) {
        return res.json(error.message);
    }
};

module.exports = { userGet, userCreate, userDelete, userUpdate, userLogin };