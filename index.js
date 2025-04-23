const express = require('express');
const app = express(); 
const mysql = require('mysql2');

// Import and use routes
const mainRoutes = require("./routes/main");
const usersRoutes = require('./routes/users');

const port = 8000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the public folder for static files
app.use(express.static(__dirname + '/public'));



// Use main routes for general routes (home, modules, quiz, contact)
app.use('/', mainRoutes);

// Use user routes for login and register (under the /users path)
app.use('/users', usersRoutes);

// Start the server
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
