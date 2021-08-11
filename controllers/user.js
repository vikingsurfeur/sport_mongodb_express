const userGet = async (req, res) => {
    res.json('My User');
};

const userCreate = async (req, res) => {
    try {
        const User = req.app.get('models').User;
        const NewUser = await new User({
            firstName: "Jean",
            lastName: "Reno",
            DateOfBirth: new Date(1980, 1, 1),
            email: "j.reno@example.com",
        });
        res.json(NewUser);
    } catch (error) {
        res.json(error.message);
        console.error(`Something get Wrong: ${error.message}`);
    }
};

module.exports = { userGet, userCreate };