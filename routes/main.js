const express = require("express");
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

function startQuiz() {
    alert("Quiz will start soon!");
}

// Home page (public access)
router.get('/', function (req, res) {
    res.render('index.ejs');
});

// Modules page (private access)
router.get('/modules', isAuthenticated, (req, res) => {
    res.render('modules', {user: req.session.user}); //pass the user to template if needed
});

// Quiz page (private access)
router.get('/quiz', isAuthenticated, (req, res) => {
    res.render('quiz', {user: req.session.user});
});

// Contact page (public access)
router.get('/contact', function (req, res) {
    res.render('contact.ejs');
});

// Export the router
module.exports = router;
