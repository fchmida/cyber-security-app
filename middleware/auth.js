function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next(); //proceed to next middleware/route if user is authenticated 
    } else {
        res.redirect('/users/login'); //redirect to login if not authenticated
    }
}

module.exports = { isAuthenticated };