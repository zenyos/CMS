const fileSystem = require("fs");
module.exports = {

    selectOption: function (status, options) {
        return options.fn(this).replace(new RegExp('value=\"'+status+'\"'), '$&selected="selected"');
    },

    isEmpty: function (obj) {
        for(let key in obj) {
            if(Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    },
    isUserAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        }
        else {
            res.redirect('/login');
        }
    },
    appliedLevel: (req, res, next) => {
       if(req.user.level > 0)
       {
           next();
       }
       else
       {
           res.redirect('/');
       }
    },
    pageRequiredLevel: (requiredLevel, currentLevel, req, res, next) => {
        return currentLevel >= requiredLevel;
    },
    getThemes: () => {
        const path = `${__dirname}/../views/themes/`;
        return fileSystem.readdirSync(path).filter(function (file) {
            return fileSystem.statSync(path + '/' + file).isDirectory();
        });
    }
};