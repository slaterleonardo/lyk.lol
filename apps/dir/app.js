const express = require('express');
const app = express.Router();
const apps = require('../../apps.json');

app.get('/', (req, res) => {
    res.render('dir', { apps });
});

app.use((req, res) => {
    res.render('dir', { apps });
});

module.exports = app;