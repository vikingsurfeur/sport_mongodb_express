const express = require('express');
const mongoose = require('mongoose');

const models = require('./models');

// Connecting to the database
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@${process.env.DB_SUFFIX}`;
const connectionParameters = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}

mongoose.connect(uri, connectionParameters)
    .then(() => {
        console.log('Connected to database ')
    })
    .catch((error) => {
        console.error(`Error connecting to the database. \n${error}`);
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