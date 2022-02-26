const {
    slotGet,
    slotCreate,
    slotBook,
    slotUpdate,
    slotDelete,
} = require("../controllers/slot");

const slotRoute = (app) => {
    // Read
    app.get("/slots", slotGet);
    // Create
    app.post("/slot-create", slotCreate);
    // Book
    app.post("/slot-book", slotBook);
    // Delete
    app.post("/slot-delete", slotDelete);
    // Update
    app.post("/slot-update", slotUpdate);
};

module.exports = slotRoute;
