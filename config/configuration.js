module.exports = {
    mongoDBUrl: 'mongodb://127.0.0.1:27017/cmsapi',
    defaultPostIMG: 'https://placeimg.com/750/300/tech',
    PORT: process.env.PORT || 3000,
    globalVariables: (req, res, next) => {
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message = req.flash('error-message');
        res.locals.user = req.user || null;
        next();
    }
};