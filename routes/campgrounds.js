const express    = require("express");
const router     = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware"); // always gets index.js by default

// INDEX - show all campgrounds:
router.get("/", (req, res) => {
  // get all campgrounds from DB:
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

// CREATE - add new campground to DB:
router.post("/", middleware.isLoggedIn, (req, res) => {
  // get data from form and add to campgrounds array:
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {
    name: name,
    price: price,
    image: image,
    description: desc,
    author: author
  };
  
  // create a new campground and save to DB:
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// NEW - show form to create new campground:
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// SHOW - show more info about one campground:
router.get("/:id", (req, res) => {
  // find campground by ID:
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// EDIT CAMPGROUND ROUTE:
// using middleware:
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  // find campground by ID:
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});

// UPDATE CAMPGROUND ROUTE:
// using middleware:
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  // find and update the correct campground:
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY CAMPGROUND ROUTE:
// using middleware:
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  // find and delete the correct campground:
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// module export:
module.exports = router;