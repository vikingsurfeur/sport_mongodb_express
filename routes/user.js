const { userGet } = require('../controllers/user');

const userRoute = (app) => {
    app.get('/user', userGet);
};

module.exports = userRoute;