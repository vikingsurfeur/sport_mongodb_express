const { coachGet, coachCreate, coachUpdate, coachDelete } = require('../controllers/coach');

const coachRoute = (app) => {
    //Read
    app.get('/coaches', coachGet);
    // Create
    app.post('/coach-create', coachCreate);
    // Delete
    app.delete('/coach-delete', coachDelete);
    // Update
    app.post('/coach-update', coachUpdate);
}

module.exports = coachRoute;