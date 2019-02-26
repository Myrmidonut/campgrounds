const express         = require("express"),
      app             = express(),
      bodyParser      = require("body-parser"),
      mongoose        = require("mongoose"),
      flash           = require("connect-flash"),
      passport        = require("passport"),
      localStrategy   = require("passport-local"),
      methodOverride  = require("method-override"),
      sanitizer       = require("express-sanitizer"),
      User            = require("./models/user");
      //seedDB          = require("./seeds");

require("dotenv").config()

const port = process.env.PORT || 3000;

// requiring routes:
const commentRoutes    = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes      = require("./routes/index");

// mongoose:
mongoose.connect(process.env.DB, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// clear DB, add campgrounds, add comments
// seedDB();

// passport configuration:
app.use(require("express-session")( {
  secret: "Rusty",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// make currentUser available in every route, run next code:
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// use routes files, routes start with "/...":
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// server:
app.listen(port, () => console.log(`Server running on port ${port}!`))