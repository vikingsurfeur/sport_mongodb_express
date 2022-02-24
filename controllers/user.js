const encryptPassword = require("../utils/encryptPassword");
const decryptPassword = require("../utils/decryptPassword");

// READ
const userGet = async (req, res) => {
    try {
        const User = req.app.get("models").User;
        const MyUsers = await User.find();
        res.json(MyUsers);
    } catch (error) {
        res.json(error.message);
        console.error(`Something get Wrong: \n${error.message}`);
    }
};

// CREATE
const userCreate = async (req, res) => {
    !req.body.password &&
        res.json({ status: false, message: "No password provided" });

    req.body.role !== "manager" && 
        res.json("unauthorized");

    try {
        const { token, salt, hash } = encryptPassword(req.body.password);

        const User = req.app.get("models").User;
        const NewUser = await new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            email: req.body.email,
            token,
            salt,
            hash,
        });
        
        const UserExist = await User.findOne({ email: req.body.email });
        if (UserExist) {
            res.json({ status: false, message: "User already exist" });
        } else {
            await NewUser.save();
            res.json({ status: true, message: "User created" });
        }
    } catch (error) {
        return res.json(error.message);
    }
};

//DELETE
const userDelete = async (req, res) => {
    if (!req.body._id) {
        return res.json({
            status: false,
            message: "No id provided",
        });
    }

    req.body.role !== "manager" &&
        res.json("unauthorized");

    try {
        const User = req.app.get("models").User;
        const ToDeleteUser = await User.findById(req.body._id);

        !ToDeleteUser &&
            res.json({ status: false, message: "User not found" });

        await ToDeleteUser.remove();

        res.json("Successfully Deleted");
    } catch (error) {
        return res.json(error.message);
    }
};

// UPDATE
const userUpdate = async (req, res) => {
    if (!req.body._id || !req.body.toModify) {
        return res.json({
            status: false,
            message: "No id provided or no data user provided",
        });
    }

    req.body.role !== "manager" &&
        res.json("unauthorized");


    try {
        const User = req.app.get("models").User;
        const ToModifyUser = await User.findById(req.body._id);
        const toModifyKeys = Object.keys(req.body.toModify);
        
        !ToModifyUser &&
            res.json({ status: false, message: "User not found" });

        for (const key of toModifyKeys) {
            ToModifyUser[key] = req.body.toModify[key];
        }

        await ToModifyUser.save();

        res.json("Successfully Updated");
    } catch (error) {
        return res.json(error.message);
    }
};

// LOGIN
const userLogin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.json({
            status: false,
            message: "No email or password provided",
        });
    }

    try {
        const User = req.app.get("models").User;
        const ToVerifyUser = await User.findOne({
            email: req.body.email,
        });

        !ToVerifyUser && 
            res.json({ status: false, message: "User not found" });
            
        res.json(decryptPassword(ToVerifyUser, req.body.password));
    } catch (error) {
        return res.json(error.message);
    }
};

module.exports = { userGet, userCreate, userDelete, userUpdate, userLogin };
