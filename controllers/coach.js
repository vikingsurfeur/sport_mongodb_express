const encryptPassword = require("../utils/encryptPassword");

// READ
const coachGet = async (req, res) => {
    try {
        const Coach = req.app.get("models").Coach;
        let CoachList;

        if (req.query.discipline) {
            CoachList = await Coach.find({
                discipline: req.query.discipline,
            });
            CoachList = await Coach.find().populate("user");
        } else {
            CoachList = await Coach.find().populate("user");
        }

        !CoachList &&
            res.json({
                status: false,
                message: "No coach found",
            });

        res.json(CoachList);
    } catch (error) {
        return res.json(error.message);
    }
};

// CREATE
const coachCreate = async (req, res) => {
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
            role: "coach",
            token: token,
            salt: salt,
            hash: hash,
        }).save();

        const newCoach = await new models.Coach({
            user: NewUser._id,
        }).save();

        res.json(newCoach);
    } catch (error) {
        return res.json(error.message);
    }
};

// DELETE
const coachDelete = async (req, res) => {
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
        const Coach = req.app.get("models").Coach;
        const ToDeleteCoach = await Coach.findById(req.body._id);
        const models = req.app.get("models");

        !ToDeleteCoach &&
            res.json({
                status: false,
                message: "No coach found",
            });

        const ToDeleteUser = await models.User.findById(ToDeleteCoach.user);

        await ToDeleteUser.remove();
        await ToDeleteCoach.remove();

        res.json({
            status: true,
            message: "Successfully Deleted"
        });
    } catch (error) {
        return res.json(error.message);
    }
};

// UPDATE
const coachUpdate = async (req, res) => {
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

        const Coach = req.app.get("models").Coach;
        const ToModifyCoach = await Coach.findById(req.body._id);
        const toModifyKeys = Object.keys(req.body.toModify);

        !ToModifyCoach &&
            res.json({
                status: false,
                message: "No coach found",
            });

        for (const key of toModifyKeys) {
            ToModifyCoach[key] = req.body.toModify[key];
        }

        await ToModifyCoach.save();

        res.json({
            status: true,
            message: "Successfully updated",
        });
    } catch (error) {
        return res.json(error.message);
    }
};

module.exports = { 
    coachGet, 
    coachCreate, 
    coachUpdate, 
    coachDelete 
};
