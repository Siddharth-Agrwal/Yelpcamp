const express       = require('express'),
      app           = express(),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      User          = require("./models/user.js"),
      Campground    = require("./models/campground.js"),
      Comment       = require("./models/comment.js"),
      methodOverride= require("method-override"),
      SeedDB        = require("./seeds.js");

const   indexRoutes       = require("./routes/index"),
        campgroundRoutes  = require("./routes/campgrounds"),
        commentRoutes     = require("./routes/comments");

// SeedDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(methodOverride("_method"));

// Passport Configuration
//=================================
app.use(require("express-session")({
    secret: "Used for password hashing",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3000, function(){
    console.log("Connected");
});