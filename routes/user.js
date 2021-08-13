const { userGet, userCreate, userDelete, userUpdate } = require('../controllers/user');

const userRoute = (app) => {
    // Read
    app.get('/users', userGet);
    // Create
    app.post('/user-create', userCreate);
    // Delete
    app.post('/user-delete', userDelete);
    // Update
    app.post('/user-update', userUpdate);
};

module.exports = userRoute;