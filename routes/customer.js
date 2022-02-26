const {
    customerGet,
    customerCreate,
    customerUpdate,
    customerDelete,
} = require("../controllers/customer");

const customerRoute = (app) => {
    // Read
    app.get("/customers", customerGet);
    // Create
    app.post("/customer-create", customerCreate);
    // Delete
    app.post("/customer-delete", customerDelete);
    // Update
    app.post("/customer-update", customerUpdate);
};

module.exports = customerRoute;
