const userGet = async (req, res) => {
    try {
        const User = req.app.get('models').User;
        const MyUsers = await User.find();
        res.json(MyUsers);
    } catch (error) {
        console.error(`Something get Wrong: \n${error.message}`);
    }
};

const userCreate = async (req, res) => {
    try {
        const User = req.app.get('models').User;
        const NewUser = await new User({
            firstName: "Jean",
            lastName: "Reno",
            dateOfBirth: new Date(),
            email: "j.reno@example.com",
        }).save();
        res.json(NewUser);
    } catch (error) {
        res.json(error.message);
        console.error(`Something get Wrong: \n${error.message}`);
    }
};

module.exports = { userGet, userCreate };