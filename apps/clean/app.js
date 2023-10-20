const express = require('express');
const app = express.Router();

app.get('/', (req, res) => {
    res.render('clean');
});

app.use((req, res) => {
    res.render('clean');
});

module.exports = app;