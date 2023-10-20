const database = require("../../model/Paste");
const express = require('express');
const axios = require('axios');
const app = express.Router();

app.get('/', function(req, res) {
    database.count().then((total_pastes) => {
        res.render('txt', { total_pastes });
    }).catch((err) => {
        res.render('txt');
    });
});

app.post('/', function(req, res) {
    let { text, self_destruct } = req.body;

    if (!text) {
        return res.render('txt', { error: 'Please provide text 😔' });
    }

    let user_input = text;

    if (self_destruct === 'on') {
        self_destruct = true;
    } else {
        self_destruct = false;
    }

    const recaptcha_response = req.body['g-recaptcha-response'];

    if (!recaptcha_response) {
        return res.render('txt', { error: 'Please complete the captcha 😡', user_input });
    }

    axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
            secret: env.RECAPTCHA_MODE === 'TEST' ? env.RECAPTCHA_SECRET_TEST : env.RECAPTCHA_SECRET,
            response: recaptcha_response,
        }
    })
        .then((response) => {
            if (!response.data.success) {
                return res.render('index', { error: 'Please complete the captcha 😡', user_input });
            }

            let link = '';

            while (link === '') {
                for (let i = 0; i < 5; i++) {
                    link += env.CHARACTERS.charAt(Math.floor(Math.random() * env.CHARACTERS.length));
                }

                database.findOne({ _id: link })
                    .then((data) => {
                        if (data) {
                            link = '';
                        }
                    });
            }

            const newPaste = new database({
                _id: link,
                text,
                self_destruct,
            });

            newPaste.save()
                .then(() => {
                    console.log('New paste saved');
                    return res.render('txt', { success: 'You\'ve successfully created a paste!', link: 'txt.lyk.lol/' + link, user_input });
                })
                .catch((err) => {
                    return res.render('txt', { error: err, user_input });
                });
        })
        .catch((err) => {
            console.error(err);
            return res.render('txt', { error: 'Something went wrong, please try again later 😔', user_input });
        });
});

app.get('/:id', function(req, res) {
    const { id } = req.params;

    database.findOne({ _id: id })
        .then((data) => {
            if (data) {
                let message = data.self_destruct ? 'This paste will self destruct after you view it 🚨' : '';

                if (data.self_destruct) {
                    database.deleteOne({ _id: id })
                        .then(() => {
                            console.log('Deleted paste');
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }

                return res.render('txt', { error: message, user_input: data.text });
            } else {
                res.status(404).render('txt', { error: 'The paste you\'re looking for doesn\'t seem to exist 😔' });
            }
        });
});

app.use((req, res) => {
    res.status(404).render('txt', { error: 'The paste you\'re looking for doesn\'t seem to exist 😔' });
})

module.exports = app;