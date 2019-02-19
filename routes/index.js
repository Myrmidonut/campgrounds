const express   = require("express");
const router    = express.Router();
const passport  = require("passport");
const User      = require("../models/user");
const sanitizer = require("express-sanitizer")

//app.use(sanitizer());

// ============== ROOT ROUTE ==============================

router.get("/", (req, res) => {
  res.render("landing");
});

// =============== AUTH ROUTES ============================

// show register form:
router.get("/register", (req, res) => {
  res.render("register");
});

// handle sign up logic:
router.post("/register", (req, res) => {
  const newUser = new User({username: req.sanitize(req.body.username)});

  User.register(newUser, req.sanitize(req.body.password), (err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to Campgrounds, " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// show login form:
router.get("/login", (req, res) => {
  res.render("login");
});

// handle login logic:
// app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", {
  failureFlash: "Username or Password wrong!",
  failureRedirect: "/login"
}), (req, res) => {
  req.flash("success", "You are logged in!");
  res.redirect("/campgrounds");
});

// logout route:
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You are logged out!");
  res.redirect("/campgrounds");
});

// module export:
module.exports = router;