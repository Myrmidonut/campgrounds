const Campground = require("../models/campground");
const Comment    = require("../models/comment");

// all middleware:
let middlewareObj = {};

// check if user is logged in and has permission:
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  // is user logged in?
  if (req.isAuthenticated()) {
    // find campground by ID:
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        req.flash("error", "Campground not found!");
        res.redirect("back");
      } else {
        // does user own the campground?
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("back");
  }
}

// check if user is logged in and has permission:
middlewareObj.checkCommentOwnership = (req, res, next) => {
  // is user logged in?
  if (req.isAuthenticated()) {
    // find comment by ID:
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        // does user own the comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("back");
  }
}

// check if user is logged in, middleware:
middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that!");
  res.redirect("/login");
}

// module export:
module.exports = middlewareObj;