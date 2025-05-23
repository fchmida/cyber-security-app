const express = require("express");
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

function startQuiz() {
    alert("Quiz will start soon!");
}

// Home page (public access)
router.get('/', (req, res) => {
    const flash = req.session.flash;
    delete req.session.flash; // 💨 Clear the flash after displaying it once

    res.render('index', {
        user: req.session.user,
        flash
    });
});

// Modules page (private access)
router.get('/modules', isAuthenticated, (req, res) => {
    res.render('modules', {user: req.session.user}); //pass the user to template if needed
});

// Modules page (private access)
router.get('/modules/security', isAuthenticated, (req, res) => {
    res.render('modules/security', {user: req.session.user}); //pass the user to template if needed
});

// Modules page (private access)
router.get('/modules/phishing', isAuthenticated, (req, res) => {
    res.render('modules/phishing', {user: req.session.user}); //pass the user to template if needed
});

// Modules page (private access)
router.get('/modules/browsing', isAuthenticated, (req, res) => {
    res.render('modules/browsing', {user: req.session.user}); //pass the user to template if needed
});

// Modules page (private access)
router.get('/modules/eng', isAuthenticated, (req, res) => {
    res.render('modules/eng', {user: req.session.user}); //pass the user to template if needed
});

// Quiz page (private access)
router.get('/quiz', isAuthenticated, (req, res) => {
    res.render('quiz', {user: req.session.user});
});

// POST Quiz Submission
router.post('/quiz', (req, res) => {
  const answers = req.body;

  let score = 0;
  if (answers.q1 === 'c') score++;
  if (answers.q2 === 'b') score++;
  if (answers.q3 === 'b') score++;
  if (answers.q4 === 'b') score++;

  // Save score to DB here if user is logged in

  res.render('quiz-result.ejs', { score }); // Create this file to display results
});

// Contact page (public access)
router.get('/contact', function (req, res) {
  res.render('contact.ejs', { error: null, success: null });
});

// POST: Handle form submission
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.render('contact.ejs', {
      error: 'Please fill in all fields.',
      success: null
    });
  }

  console.log('Contact form submitted:', { name, email, message });

  // Respond with success message
  res.render('contact.ejs', {
    error: null,
    success: 'Thank you for your message! We will get back to you shortly.'
  });
});
// Export the router
module.exports = router;
