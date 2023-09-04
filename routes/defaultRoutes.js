const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel').User;
const Setting = require('../models/SettingModel').Setting;

router.route('/installation')
    .post(defaultController.postInstallation);

router.all('/*', async (req, res, next) => {
    const settings = await Setting.find().lean();
    if(settings.length <= 0) {
        return res.render('installation/index');
    }
    res.locals.websiteName = settings[0].websiteName;
    res.locals.websiteCopyright = settings[0].websiteCopyright;
    res.locals.websiteLanguage = settings[0].websiteLanguage;
    res.locals.websiteDirection = settings[0].websiteDirection;
    res.locals.websiteTelegramURL = settings[0].websiteTelegramURL;
    res.locals.websiteGooglePlusURL = settings[0].websiteGooglePlusURL;
    res.locals.websiteFacebookURL = settings[0].websiteFacebookURL;
    res.locals.websiteTwitterURL = settings[0].websiteTwitterURL;
    res.locals.websiteLinkedInURL = settings[0].websiteLinkedInURL;
    res.locals.websiteInstagramURL = settings[0].websiteInstagramURL;
    res.locals.websitePaginationLimit = settings[0].websitePaginationLimit;
    res.locals.requiredUrl = req.path;
    req.app.locals.layout = 'index';
    next();
});

router.route('/')
    .get(defaultController.index);

router.route('/page/:page')
    .get(defaultController.indexPagination);

// Defining Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({email: email}).then(user => {

        if (!user) {
            return done(null, false, req.flash('error-message', 'User not found with this email.'));
        }

        bcrypt.compare(password, user.password, (err, passwordMatched) => {
            if (err) {
                return err;
            }
            if (!passwordMatched) {
                req.flash('error-message', 'Invalid Username or Password');
                return done(null, false);
            }

            return done(null, user, req.flash('success-message', 'Login Successful'));
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


// noinspection JSCheckFunctionSignatures
router.route('/login')
    .get(defaultController.loginGet)
    .post(passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true,
        session: true
    }) ,defaultController.loginPost);

router.route('/register')
    .get(defaultController.registerGet)
    .post(defaultController.registerPost);

router.route('/post/:id')
    .get(defaultController.getSinglePost)
    .post(defaultController.submitComment);

router.route('/result')
    .get(defaultController.resultGet)
    .post(defaultController.resultPost);

router.route('/result/:cat')
    .get(defaultController.resultCatGet)
    .post(defaultController.resultPost);

router.route('/result/user/:id')
    .get(defaultController.resultUserGet)
    .post(defaultController.resultPost);

router.route('/profile')
    .get(defaultController.getProfile)
    .post(defaultController.submitProfile);

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success-message', 'Logout was successful');
        res.redirect('/');
    });
});
async function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
module.exports = router;