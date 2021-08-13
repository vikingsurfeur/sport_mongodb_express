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

const userCreate = async (req, res) => {
    try {
        const User = req.app.get('models').User;
        const NewUser = await new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            email: req.body.email,
        }).save();
        res.json(NewUser);
    } catch (error) {
        res.json(error.message);
        console.error(`Something get Wrong: \n${error.message}`);
    }
};

const userDelete = async (req, res) => {
    try {
        if (!req.body._id) {
            return res.json({
                status: false,
                message: 'No id provided',
            });
        }
        const User = req.app.get('models').User;
        const ToDeleteUser = await User.findById(req.body._id);
        await ToDeleteUser.remove();
        res.json('Successfully Deleted');
    } catch (error) {
        res.json(error.message);
        console.error(`Something get Wrong: \n${error.message}`);
    }
};

const userUpdate = async (req, res) => {
    try {
        if (!req.body._id || !req.body.toModifyUser) {
            return res.json({
                status: false,
                message: 'No id provided or no data user provided',
            });
        }
        const User = req.app.get('models').User;
        const ToModifyUser = await User.findById(req.body._id);
        const toModifyKeys = Object.keys(req.body.toModifyUser);
        for (const key of toModifyKeys) {
            ToModifyUser[key] = req.body.toModifyUser[key];
        }
        await toModifyUser.save();
        res.json('Successfully Updated');
    } catch (error) {
        res.json(error.message);
        console.error(`Something get Wrong: \n${error.message}`);
    }
};

module.exports = { userGet, userCreate, userDelete, userUpdate };