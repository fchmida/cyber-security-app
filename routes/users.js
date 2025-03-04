const express = require("express");
const router = express.Router();

//register routes
router.get('/register', function (req, res) {
    res.render('register.ejs');
});

//login routes
router.get('/login', function (req, res) {
    res.render('register.ejs');
})

// Export the router
module.exports = router;