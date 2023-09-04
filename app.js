// Importing Modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const _handlebars = require('handlebars')
const util = require('handlebars-utils');
const hbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const hbshelpers = require('handlebars-helpers');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const fileSystem = require('fs');
const passport = require('passport');
const { I18n } = require('i18n');

// Local Modules
const {mongoDBUrl, PORT, globalVariables} = require('./config/configuration');
const {selectOption} = require('./config/customFunction');
const Setting = require('./models/SettingModel').Setting;

const app = express();
const multihelpers = hbshelpers();

// Main Global Variables
let _THEMENAME = 'default';
let getThemeTimer = 0;
// Configure Mongoose to Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(mongoDBUrl, { useNewUrlParser: true})
    .then( response => {
        console.log("MongoDB connected Successfully.");
        getTheme();
        getThemeTimer = setInterval(getTheme, 1000);
    }).catch( err => {
        console.log("Database connection failed, error: " + err);
});

// Configure Express
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Flash and Session
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true, // check in future
    resave: true,
}));

// Flash Message
app.use(flash());

/* Passport Initialize */
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use(globalVariables);

// File Upload Middleware
app.use(fileUpload());

// Setup Ejs View Engine
app.set('view engine', 'ejs');
app.set('views', __dirname + `/views/themes/${_THEMENAME}/`);

//Configure I18n Module For Multilanguage Support
const i18n = new I18n({
    locales: ['en', 'fa'],
    directory: path.join(__dirname, 'locales'),
    updateFiles: false,
    defaultLocale: 'en'
});

module.exports = function(req, res, next) {
    i18n.init(req, res);
    res.locals.__ = res.__;
    var current_locale = i18n.getLocale();
    return next();
};

app.use(i18n.init);

// Method Override Middleware
app.use(methodOverride('newMethod'));

// Seprate Admin And Default Views
app.use('*', async (req, res, next) => {
    await Setting.find().lean().then(setting => {
        if(setting.length <= 0) {
            if(_THEMENAME)
                app.set('views', __dirname + `/views/themes/${_THEMENAME}/`);
            next();
            return firstSetupWebsite();
        }
        _THEMENAME = setting[0].websiteTheme;
        req.setLocale(setting[0].websiteLanguage);
        if (fileSystem.existsSync(`views/themes/${setting[0].websiteTheme}/settings/index.ejs`) && fileSystem.existsSync(`views/themes/${setting[0].websiteTheme}/settings/settings.json`)) {
            let custom_theme_settings_location = `views/themes/${setting[0].websiteTheme}/settings/settings.json`;
            fileSystem.readFile(custom_theme_settings_location, "utf8", (err, jsonString) => {
                if (err) {
                    console.log("File read failed:", err);
                    return;
                }
                res.locals.CustomTemplateSettings = JSON.parse(jsonString);
                if(req.originalUrl.indexOf("admin") > -1) {
                    app.set('views', __dirname + `/views/themes/default/`);
                    next();
                }
                else {
                    if(_THEMENAME)
                        app.set('views', __dirname + `/views/themes/${_THEMENAME}/`);
                    next();
                }
            });
        }
        else
        {
            if(req.originalUrl.indexOf("admin") > -1) {
                app.set('views', __dirname + `/views/themes/default/`);
                next();
            }
            else {
                if(_THEMENAME)
                    app.set('views', __dirname + `/views/themes/${_THEMENAME}/`);
                next();
            }
        }
    });
    
});

// Routes
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);
app.use((req, res, next) => {
    res.status(404).render('index', {path: '404'});
});

// Server Start Engine
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Custom Main Functions
async function getTheme() {
    await Setting.find().lean().then(setting => {
        if(setting.length <= 0) {
            return firstSetupWebsite();
        }
        //_THEMENAME = setting[0].websiteTheme;
        app.set('views', __dirname + `/views/themes/${_THEMENAME}/`);
    });
}

async function firstSetupWebsite()
{
    clearInterval(getThemeTimer);
}















/*

                محمد کیانی

            Instagram: https://instagram.com/diariesvexar 

        Telegram: https://t.me/vexyboy

*/


























