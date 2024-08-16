// Middleware to check if the user is authenticated

module.exports = function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.loginUser) {
    return next();
  }
  // res.status(401).send("Unauthorized");
  req.session.returnTo = req.url; // Store the original URL
  res.redirect('/login');
};
