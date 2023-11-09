const database = require("../../models/Link");
const express = require('express');
const axios = require('axios');
const app = express.Router();

app.get('/', function(req, res) {
    database.count().then((total_links) => {
        res.render('index', { total_links });
    }).catch((err) => {
        res.render('index');
    });
});

app.post('/', function(req, res) {
    let { link } = req.body;

    if (!link || typeof link != "string") {
        return res.render('index', { error: 'Please provide a link 😔' });
    }

    link = link.toLowerCase()

    const user_input = link;
    const valid_url = /^(https?:\/\/)?(www\.)?[^\/\s]+\/.*?$/.test(link);

    if (!valid_url) {
        return res.render('index', { error: 'The link you entered looks to be invalid 😔', user_input });
    }

    if (!link.includes('http://') && !link.includes('https://')) {
        link = 'https://' + link;
    }

    const recaptcha_response = req.body['g-recaptcha-response'];

    if (!recaptcha_response) {
        return res.render('index', { error: 'Please complete the captcha 😡', user_input });
    }

    axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
            secret: env.RECAPTCHA_MODE === 'TEST' ? env.RECAPTCHA_SECRET_TEST : env.RECAPTCHA_SECRET,
            response: recaptcha_response,
        }
    }).then((response) => {
        if (!response.data.success) {
            return res.render('index', { error: 'Please complete the captcha 😡', user_input });
        }

        let new_link = '';

        while (new_link === '') {
            for (let i = 0; i < 5; i++) {
                new_link += env.CHARACTERS.charAt(Math.floor(Math.random() * env.CHARACTERS.length));
            }

            database.findOne({ _id: new_link })
                .then((data) => {
                    if (data) {
                        new_link = '';
                    }
                });
        }

        const newLink = new database({
            _id: new_link,
            original_link: link,
        });

        newLink.save()
            .then(() => {
                console.log('New link saved');
                return res.render('index', { success: 'You\'ve successfully shortened your link!', link: 'lyk.lol/' + new_link, user_input });
            })
            .catch((err) => {
                return res.render('index', { error: err, user_input });
            });
        }).catch((err) => {
            console.error(err);
            return res.render('index', { error: 'Something went wrong, please try again later 😔', user_input });
        });
});

app.get('/:id', function(req, res) {
    const { id } = req.params;

    database.findOne({ _id: id })
        .then((data) => {
            if (data) {
                data.clicks++;
                data.save();

                res.redirect(data.original_link);
            } else {
                res.render('index', { error: 'The link you\'re looking for doesn\'t seem to exist, but you can generate a new link here 😄' });
            }
        });
});

app.use((req, res) => {
    res.status(404).render('index', { error: 'The link you\'re looking for doesn\'t seem to exist, but you can generate a new link here 😄' });
})

module.exports = app;
