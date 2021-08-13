const { userGet, userCreate, userDelete, userUpdate } = require('../controllers/user');

const userRoute = (app) => {
    // Read
    app.get('/user', userGet);
    // Create
    app.post('/create', userCreate);
    // Delete
    app.post('/delete', userDelete);
    // Update
    app.post('/update', userUpdate);
};

module.exports = userRoute;