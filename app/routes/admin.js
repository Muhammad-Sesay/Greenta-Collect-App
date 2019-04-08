//importing the modules
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//importing the enumerator model
// var Admins = require('../models/admin_model');
var Enumerators = require('../models/enumerator_model');

//get request for the index
router.get('/admin/login', (req, res) => {

    // rendering the page
    res.render('adminLogin', {
        pageTitle: "admin",
        pageID: "admin"
    });
});

//get request for the index
router.get('/admin', (req, res) => {

    // rendering the page
    res.render('adminIndex', {
        pageTitle: "adminIndex",
        pageID: "adminIndex"
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        Enumerators.getEnumeratorByUsername(username, (err, enumerator) => {
            if(err) throw err;
            if(!enumerator){
                return done(null, false, {message: 'Incorrect Username'});
            }

        // checking if the password matches
        Enumerators.comparePassword(password, enumerator.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                return done(null, enumerator);
            }else{
                return done(null, false, {message: 'Incorrect Password'});
            }
        });
       });
    }
));

passport.serializeUser((enumerator, done) => {
    done(null, enumerator.id);
});

passport.deserializeUser((id, done) => {
    Enumerators.getEnumeratorById(id, function(err, enumerator){
        done(err, enumerator);
    });
});


// post request for the login
router.post('/admin/login', (req, res, next) => {
    const { username, password } = req.body;
    let errors = [];

    //check required fields
    if(!username || !password){
        errors.push({ msg: 'Please fill in all fields'});
    } 

    if(errors.length > 0){
        res.render('adminLogin',{
            errors,
            username,
            password
        });
    }
    // authenticating the user
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next);

});

//logout request
router.get('/logout', (req, res) => {

    req.logout(); //passport middleware
    req.flash('success_msg', 'You have logged out');
    res.redirect('/'); //redirecting to the login page
});

//exporting the module
module.exports = router;
