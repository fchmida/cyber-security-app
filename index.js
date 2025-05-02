const express = require('express');
const app = express(); 
const mysql = require('mysql2');
const expressSanitizer = require('express-sanitizer');
const session = require('express-session');
const validator = require ('express-validator');

const port = 8000;

app.use(expressSanitizer());

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the public folder for static files
app.use(express.static(__dirname + '/public'));

// Define db connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'cyber_awareness'
});

// Connect to db
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
});
global.db = db;

// Define our application-specific data
// app.locals.financeData = {appName:"Personal Finance Tracker"};
;

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}));

//middleware to make 'user' accessible in all templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // Set `user` for all templates
    next();
});  

//middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Use main routes for general routes (home, modules, quiz, contact)
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

// Use user routes for login and register (under the /users path)
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

// Start the server
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
