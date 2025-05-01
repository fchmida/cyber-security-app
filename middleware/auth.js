function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}

module.exports = { isAuthenticated };