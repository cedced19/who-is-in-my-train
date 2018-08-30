var express = require('express');
var router = express.Router();
var auth = require('connect-ensure-login').ensureLoggedIn;
var randomstring = require('randomstring');

/* GET home page */
router.get('/', function (req, res, next) {
    res.render('index', { user: req.user });
});

router.get('/login', function (req, res) {
    res.render('login', { user: req.user });
});

router.get('/api/profile', function (req, res) {
    if (req.user) {
        res.json({ name: req.user.displayName, id: req.user.id });
    } else {
        res.json({ error: 'not logged' });
    }
});

router.post('/api/take_train', auth(), function (req, res) {
    var obj = {
        train_date: req.body.train_date,
        train_id: req.body.train_id,
        train_type: req.body.train_type,
        user_name: req.user.displayName,
        user_id: req.user.id,
        uuid: randomstring.generate(7)
    };
    req.app.planedTrains.post(obj, function (err) {
        if (err) return next (err);
        res.json(obj);
    });
});

module.exports = router;