var express = require('express');
var router = express.Router();

/* GET home page */
router.get('/', function (req, res, next) {
    res.render('index', { user: req.user });
});

router.get('/api/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
        res.json({ name: req.user.displayName, id: req.user.id });
});

module.exports = router;