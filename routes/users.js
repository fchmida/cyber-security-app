const express = require("express");
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const { check, validationResult } = require('express-validator');

// Dashboard route (private access)
router.get('/dashboard', isAuthenticated, (req, res) => {
    console.log("Dashboard route hit by user:", req.session.user);

    const userId = req.session.user.id;

    const sql = 'SELECT quiz_name, score, DATE_FORMAT(taken_at, "%Y-%m-%d %H:%i") AS taken_date FROM quiz_scores WHERE user_id = ? ORDER BY taken_at DESC';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching quiz scores:', err);
            return res.status(500).send('Server error');
        }

        console.log("Scores retrieved:", results);  // Debug log
        res.render('dashboard.ejs', {
            user: req.session.user,
            scores: results || []
        });
    });
});



//register routes
router.get('/register', function (req, res) {
    res.render('register.ejs');
});

router.post('/registered', [
    check('email').isEmail().withMessage('Please enter a valid email address'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
], function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('register.ejs', {
            errors: errors.array(),
            username: req.sanitize(req.body.username) || "",
            email: req.sanitize(req.body.email) || ""
        });
    }

    const username = req.sanitize(req.body.username);
    const email = req.sanitize(req.body.email);
    const password = req.body.password;

    if (!username || !email || !password) {
        return res.status(400).send("All fields are required.");
    }

    console.log("Attempting to register user:", { username, email });

    bcryptjs.hash(password, saltRounds, function (err, hashedPassword) {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send("An error occurred during password hashing.");
        }

        const sql = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
        db.query(sql, [username, email, hashedPassword], function (err, result) {
            if (err) {
                console.error('Error inserting user data:', err);
                return res.status(500).send("An error occurred while saving your data.");
            }

            console.log('User inserted with ID:', result.insertId);

            req.session.userId = result.insertId;
            req.session.user = {
                username: username
            };

            res.redirect('/users/login');
        });
    });
});


// Login route
router.get('/login', function (req, res) {
    const message = req.query.message === 'logged_out' ? 'You have been logged out.': null;
    res.render('login.ejs', { user: req.session.user, message });
});

router.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    console.log("Login attempt: ", username, password);

    if (!username || !password) {
        return res.status(400).send("Both username and password are required.");
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], function (err, result) {
        console.log("Database result: ", result);
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send("Server error.");
        }

        if (result.length === 0) {
            console.log("User not found.");
            return res.render('login.ejs', {
                message: "User not found.",
                user: null
            });
        }

        bcryptjs.compare(password, result[0].password_hash, function (err, isMatch) {
            console.log("Password match: ", isMatch);
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send("Server error.");
            }

            if (isMatch) {
                req.session.userId = result[0].user_id;
                req.session.user = {
                    username: result[0].username
                };

                req.session.flash = {message: `Welcome back, ${result[0].username}!`}; //flash msg
                console.log("Session data set:", req.session.user);
                return res.redirect('/');  // redirects to home after login
            } else {
                console.log("Incorrect password.");
                return res.render('login.ejs', {
                    message: "Incorrect password.",
                    user: null
                });
            }
        });
    });
});

// Logout route (only accessible when logged in)
router.get('/logout', isAuthenticated, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session during logout:", err);
            return res.status(500).send("Could not log out. Please try again.");
        }
        res.redirect('/users/login?message=logged_out');
    });
});


// Export the router
module.exports = router;