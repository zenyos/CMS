const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const {isUserAuthenticated, appliedLevel} = require('../config/customFunction');
const {Setting} = require("../models/SettingModel");

router.all('/*', isUserAuthenticated, appliedLevel, async (req, res, next) => {
    const settings = await Setting.find().lean();
    req.app.locals.layout = '/admin';
    next();
})

// ADMIN POSTS ROUTES
router.route('/')
    .get(adminController.index);

router.route('/posts')
    .get(adminController.getPosts)
    .post(adminController.submitPosts);

router.route('/posts/create')
    .get(adminController.createPostGet)
    .post(adminController.submitPosts);

router.route('/posts/edit/:id')
    .get(adminController.editPost)
    .put(adminController.editPostSubmit);

router.route('/posts/delete/:id')
    .delete(adminController.deletePost);

// ADMIN CATEGORY ROUTES
router.route('/category')
    .get(adminController.getCategories);

router.route('/category/create')
    .post(adminController.createCategories);

router.route('/category/edit/:id')
    .get(adminController.editCategoriesGetRoute)
    .post(adminController.editCategoriesPostRoute);

router.route('/category/delete/:id')
    .delete(adminController.deleteCategory);

// ADMIN COMMENTS ROUTES
router.route('/comment')
    .get(adminController.getComments);

router.route('/comment/switch/:id')
    .get(adminController.getComments)
    .post(adminController.updateComments);

router.route('/comment/delete/:id')
    .delete(adminController.deleteComment);

// ADMIN SETTINGS ROUTES
router.route('/settings')
    .get(adminController.getSettings);

router.route('/settings/update')
    .get(adminController.getSettings)
    .post(adminController.submitSettings);

// ADMIN USERS ROUTES
router.route('/users')
    .get(adminController.getUsers);

router.route('/users/edit/:id')
    .get(adminController.editUser)
    .put(adminController.editUserSubmit);

module.exports = router;