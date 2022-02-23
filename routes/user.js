const {
    userGet,
    userCreate,
    userDelete,
    userUpdate,
    userLogin,
} = require("../controllers/user");

const userRoute = (app) => {
    // Read
    app.get("/users", userGet);
    // Create
    app.post("/user-create", userCreate);
    // Delete
    app.post("/user-delete", userDelete);
    // Update
    app.post("/user-update", userUpdate);
    // Login
    app.post("/user-login", userLogin);
};

module.exports = userRoute;
