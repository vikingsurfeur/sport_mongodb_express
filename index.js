const express = require('express');

const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
    res.json('Hello World!');
});

app.listen(3000, () => {
    console.log('Server Successfully Launched')
});