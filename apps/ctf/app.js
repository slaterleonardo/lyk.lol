const express = require('express');
const app = express.Router();
const apps = require('../../apps.json');

app.get('/', (req, res) => {
    url_query = req.query;
    post_data = req.body;

    console.log(post_data)

    res.render('ctf', {
        url_query: Object.keys(url_query).length === 0 ? null : url_query,
        post_data: Object.keys(post_data).length === 0 ? null : post_data,
    });
});

app.use((req, res) => {
    res.render('ctf');
});

module.exports = app;