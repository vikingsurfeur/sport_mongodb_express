const userGet = async (req, res) => {
    res.json('My User');
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
        console.error(`Something get Wrong: ${error.message}`);
    }
};

module.exports = { userGet, userCreate };