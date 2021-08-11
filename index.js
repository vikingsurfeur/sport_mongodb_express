const express = require('express');
const mongoose = require('mongoose');

const models = require('./models');

// Connecting to the database
mongoose.connect('mongodb://localhost/sport_center', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

// Create Express server
const app = express();
app.set('models', models);
app.use(express.json());

// Require the User Route
const userRoute = require('./routes/user');
userRoute(app);

// Localhost port 3000
app.listen(3000, () => {
    console.log('Server Successfully Launched')
});