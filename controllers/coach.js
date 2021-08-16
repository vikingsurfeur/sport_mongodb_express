const encryptPassword = require('../utils/encryptPassword');

const coachGet = async (req, res) => {
    try {
        const Coach = req.app.get('models').Coach;
        let CoachList;

        if (req.query.discipline) {
            CoachList = await Coach.find({
                discipline: req.query.discipline,
            });
            CoachList = await Coach.find().populate('user');
        } else {
            CoachList = await Coach.find().populate('user');
        }

        if (!CoachList) {
            return res.json({
                status: false,
                message: 'No coachs found',
            });
        }

        res.json(CoachList);
    } catch (error) {
        return res.json(error.message);
    }
}

const coachCreate = async (req, res) => {
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

        const newCoach = await new models.Coach({
            user: NewUser._id,
        }).save();

        res.json(newCoach);
    } catch (error) {
        return res.json(error.message);
    }
}

const coachUpdate = async (req, res) => {
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
        if (!req.body._id || !req.body.toModifyCoach) {
            return res.json({
                status: false,
                message: 'No id provided or no data user provided',
            });
        }

        const Coach = req.app.get('models').Coach;
        const toModifyCoach = await Coach.findById(req.body._id);

        if (!toModifyCoach) {
            return res.json({
                status: false,
                message: 'No coach found',
            });
        }

        const toModifyKeys = Object.keys(req.body.toModifyCoach);
        for (const key of toModifyKeys) {
            toModifyCoach[key] = req.body.toModifyCoach[key];
        }
        await toModifyCoach.save();
        res.json('Successfully Updated');
    } catch (error) {
        return res.json(error.message);
    }
}

const coachDelete = async (req, res) => {
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
        const Coach = req.app.get('models').Coach;
        const toDeleteCoach = await Coach.findById(req.body._id);

        if (!toDeleteCoach) {
            return res.json({
                status: false,
                message: 'No coach found',
            });
        }

        const toDeleteUser = await models.User.findById(toDeleteCoach.user);

        await toDeleteUser.remove();
        await toDeleteCoach.remove();
        res.json('Successfully Deleted');
    } catch (error) {
        return res.json(error.message);
    }
}

module.exports = { coachGet, coachCreate, coachUpdate, coachDelete };