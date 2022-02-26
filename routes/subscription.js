const {
    subscriptionGet,
    subscriptionCreate,
    subscriptionUpdate,
    subscriptionDelete,
} = require("../controllers/subscription");

const subscriptionRoute = (app) => {
    // Read
    app.get("/subscriptions", subscriptionGet);
    // Create
    app.post("/subscription-create", subscriptionCreate);
    // Delete
    app.post("/subscription-delete", subscriptionDelete);
    // Update
    app.post("/subscription-update", subscriptionUpdate);
};

module.exports = subscriptionRoute;
