const express = require('express');

const app = express();
app.use(express.json());

const userRoute = require('./routes/user');
userRoute(app);

app.listen(3000, () => {
    console.log('Server Successfully Launched')
});