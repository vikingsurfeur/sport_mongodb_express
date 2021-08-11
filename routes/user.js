const { userGet, userCreate } = require('../controllers/user');

const userRoute = (app) => {
    // Create
    app.post('/create', userCreate);
    // Read
    app.get('/user', userGet);
};

module.exports = userRoute;