const express = require('express');
const mongoose = require('mongoose');

const models = require('./models');
const getRoleMiddleware = require('./utils/getRoleMiddleware');

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
app.use(getRoleMiddleware);

// Require Routes
const userRoute = require('./routes/user');
const customerRoute = require('./routes/customer');
const coachRoute = require('./routes/coach');
const subscriptionRoute = require('./routes/subscription');
const slotRoute = require('./routes/slot');
userRoute(app);
customerRoute(app);
coachRoute(app);
subscriptionRoute(app);
slotRoute(app);

// Localhost port 3000
app.listen(3000, () => {
    console.log('Server Successfully Launched')
});