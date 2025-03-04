const express = require("express");
const router = express.Router();

function startQuiz() {
    alert("Quiz will start soon!");
}

// Home page (public access)
router.get('/', function (req, res) {
    res.render('index.ejs');
});

// Modules page (public access)
router.get('/modules', function (req, res) {
    res.render('modules.ejs');
});

// Quiz page (public access)
router.get('/quiz', function (req, res) {
    res.render('quiz.ejs');
});

// Contact page (public access)
router.get('/contact', function (req, res) {
    res.render('contact.ejs');
});

// Export the router
module.exports = router;
