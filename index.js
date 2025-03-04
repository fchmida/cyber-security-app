const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql2');

const app = express(); 
const port = 8000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the public folder for static files
app.use(express.static(__dirname + '/public'));

// Import and use routes
const mainRoutes = require("./routes/main");
const usersRoutes = require('./routes/users');

app.use('/', mainRoutes);
app.use('/users', usersRoutes);

// Start the server
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
