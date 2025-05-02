const express = require("express");
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const { check, validationResult } = require('express-validator');


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

                console.log("Session data set:", req.session.user);
                return res.redirect('/');  // Change this to the appropriate route
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

// Export the router
module.exports = router;