const { userGet, userCreate, userDelete } = require('../controllers/user');

const userRoute = (app) => {
    // Create
    app.post('/create', userCreate);
    // Read
    app.get('/user', userGet);
    // Delete
    app.post('/delete', userDelete);
};

module.exports = userRoute;