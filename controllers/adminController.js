const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const Comment = require('../models/CommentModel').Comment;
const Setting = require('../models/SettingModel').Setting;
const User = require('../models/UserModel').User;
const {isEmpty, pageRequiredLevel, getThemes} = require('../config/customFunction');
const {defaultPostIMG} = require("../config/configuration");
const bcrypt = require("bcryptjs");
const fs = require('fs-extra');

let postImgPath = defaultPostIMG;
let uploaded_filename = '';
module.exports = {

    index: (req, res) => {
        res.render('admin/index', {path:"dashboard"});
    },

    getPosts: (req, res) =>  {
        if(!pageRequiredLevel(2, req.user.level))
            return res.render('admin/index', {path:"dashboard"});
        Post.find().sort({$natural: -1}).lean()
            .populate('user')
            .then(posts => {
                res.render('admin/posts/index', {posts: posts, path:"all-posts"});
        });
    },

    createPostGet: (req, res) => {
        if(!pageRequiredLevel(2, req.user.level))
            return res.render('admin/index', {path:"dashboard"});
        Category.find().lean().then(cats => {
            res.render('admin/posts/create', {categories: cats, path:"create-posts"});
        });
    },

    submitPosts: async (req, res) => {
        const commentsAllowed = !!req.body.allowComments;

        if(!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            uploaded_filename = file.name;
            let uploadDir = './public/uploads/';
            postImgPath = `/uploads/${uploaded_filename}`;
            file.mv(uploadDir + uploaded_filename, (error) => {
                if (error)
                    throw error;
            });
        }
        let DownloadBox_Content;
        let GalleryBox_Content;
        let LinkBox_Content;
        let InfoBox_Content;
        if(!req.body.useDownloadBox)
            DownloadBox_Content = "";
        else {
            if(req.body.download_elements_data.length > 0) {
                DownloadBox_Content = req.body.download_elements_data;
            }
            else {
                DownloadBox_Content = "";
            }
        }
        if(!req.body.useGalleryBox)
            GalleryBox_Content = "";
        else
            GalleryBox_Content = req.body.gallery_box_description;
        if(!req.body.useLinkBox)
            LinkBox_Content = "";
        else
            LinkBox_Content = req.body.link_box_description;

        if(!req.body.useInfoBox)
            InfoBox_Content = "";
        else
            InfoBox_Content = req.body.info_box_description;

        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            description_more: req.body.description_more,
            status: req.body.status,
            allowComments: commentsAllowed,
            useDownloadBox: req.body.useDownloadBox,
            useGalleryBox: req.body.useGalleryBox,
            useLinkBox: req.body.useLinkBox,
            useInfoBox: req.body.useInfoBox,
            DownloadBoxContent: DownloadBox_Content,
            GalleryBoxContent: GalleryBox_Content,
            LinkBoxContent: LinkBox_Content,
            InfoBoxContent: InfoBox_Content,
            category: req.body.category,
            file: postImgPath,
            user: req.user.id
        });

        newPost.save().then(() => {
            console.log('Post created successfully.');
            req.flash('success-message', 'Post created successfully.');
            res.redirect('/admin/posts');
        });
    },

    editPost: (req, res) => {
        if(!pageRequiredLevel(2, req.user.level))
            return res.render('admin/index', {path:"dashboard"});
        const id = req.params.id;

        Post.findById(id).lean()
        .then(post => {
            Category.find().lean().then(cats => {
                res.render('admin/posts/edit', {post: post, categories: cats, path: "all-posts"});
            });
        });
    },

    editPostSubmit: (req, res) => {
        const commentsAllowed = !!req.body.allowComments;
        const id = req.params.id;
        if (!isEmpty(req.files)) {
            if (!isEmpty(req.files.uploadedFile)) {
                let file = req.files.uploadedFile;
                uploaded_filename = file.name;
                let uploadDir = './public/uploads/';
                postImgPath = `/uploads/${uploaded_filename}`;
                file.mv(uploadDir + uploaded_filename, (error) => {
                    if (error)
                        throw error;
                });
            }
            else {
                postImgPath = '';
            }
        }
        else {
            postImgPath = '';
        }
        Post.findById(id)
            .then(post => {
                let galleryImagesName = {};
                post.title = req.body.title;
                post.status = req.body.status;
                post.allowComments = commentsAllowed;
                post.useDownloadBox = req.body.useDownloadBox;
                post.useGalleryBox = req.body.useGalleryBox;
                post.useLinkBox = req.body.useLinkBox;
                post.useInfoBox = req.body.useInfoBox;

                if(!post.useDownloadBox) {
                    post.DownloadBoxContent = "";
                }
                else {
                   if(req.body.download_elements_data.length > 0) {
                       post.DownloadBoxContent = req.body.download_elements_data;
                   }
                   else
                       post.DownloadBoxContent = "";
                }
                if(!req.body.useGalleryBox)
                   post.GalleryBoxContent = "";
                else {
                   if (!isEmpty(req.files)) {
                       if (!isEmpty(req.files.gallery_image)) {
                           let gallery_files = req.files.gallery_image;
                           let uploadDir = `./public/uploads/gallery/${post._id.toString()}/`;
                           let uploadPath = `./public/uploads/gallery/${post._id.toString()}`;
                           if (gallery_files.length) {
                               let parse_obj = [];
                               let dataItem = {};
                               gallery_files.forEach(function (galleryFile, index) {
                                   let gallery_image_name = galleryFile.name;

                                   if (!fs.existsSync(uploadPath)) {
                                       try {
                                           return fs.mkdirSync(uploadPath);
                                       } catch (err) {
                                           if (err.code !== 'EEXIST') throw err
                                       }
                                   }
                                   galleryFile.mv(uploadDir + gallery_image_name, (error) => {
                                       if (error)
                                           throw error;
                                   });
                                   dataItem = {Id: index, image: gallery_image_name};
                                   parse_obj.push(dataItem);
                                   galleryImagesName = JSON.stringify(parse_obj);
                               });
                           } else {
                               let parse_obj = [];
                               let dataItem = {};
                               let gallery_image = gallery_files;
                               let gallery_image_name = gallery_files.name;

                               if (!fs.existsSync(uploadPath)) {
                                   try {
                                       return fs.mkdirSync(uploadPath);
                                   } catch (err) {
                                       if (err.code !== 'EEXIST') throw err
                                   }
                               }
                               gallery_image.mv(uploadDir + gallery_image_name, (error) => {
                                   if (error)
                                       throw error;
                               });
                               dataItem = {Id: 0, image: gallery_image_name};
                               parse_obj.push(dataItem);
                               galleryImagesName = JSON.stringify(parse_obj);
                           }
                       }
                   }
                   if(req.body.gallery_elements_data.length > 0) {
                       post.GalleryBoxContent = req.body.gallery_elements_data;
                   }
                }
                if(!req.body.useLinkBox)
                   post.LinkBoxContent = "";
                else {
                   if(req.body.link_elements_data.length > 0) {
                       post.LinkBoxContent = req.body.link_elements_data;
                   }
                }

                if(!req.body.useInfoBox)
                    post.InfoBoxContent = "";
                else {
                    if(req.body.info_elements_data.length > 0) {
                        post.InfoBoxContent = req.body.info_elements_data;
                    }
                }
                let descriptionModified = req.body.description.replace(/(?:\r\n|\r|\n)/g, '<br>');
                let descriptionMoreModified = req.body.description_more.replace(/(?:\r\n|\r|\n)/g, '<br>');
                post.description = descriptionModified;
                post.description_more = descriptionMoreModified;
                post.category = req.body.category;
                if(!isEmpty(postImgPath))
                   post.file = postImgPath;

                post.save().then(updatePost => {
                   console.log(`The Post ${updatePost.title} has been updated.`);
                   req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
                   res.redirect('/admin/posts');
                });
            });
    },

    deletePost: (req, res) => {
        if(!pageRequiredLevel(2, req.user.level))
            return res.render('admin/index', {path:"dashboard"});
        Post.findByIdAndDelete(req.params.id).lean().then(deletedPost => {
            console.log(`The post (${deletedPost.title}) has been deleted successfully.`);
            req.flash('success-message', `The post (${deletedPost.title}) has been deleted successfully.`);
            res.redirect('/admin/posts');
        });
    },

    //ALL CATEGORY METHODS
    getCategories: (req, res) => {
        if(!pageRequiredLevel(3, req.user.level))
            return res.render('admin/index', {path:"dashboard"});
        Category.find().lean().then(cats => {
            res.render('admin/category/index', {categories: cats, path:"categories"});
        });
    },

    createCategories: (req, res) => {
        if(!pageRequiredLevel(3, req.user.level))
            return res.render('admin/index', {path:"dashboard"});
        const categoryName = req.body.name;
        if(categoryName) {
            const newCategory = new Category({
                title: categoryName
            });

            newCategory.save().then(category => {
                res.status(200).json(category);
            });
        }
    },

    editCategoriesGetRoute: async (req, res) => {
        if(!pageRequiredLevel(3, req.user.level))
            return res.render('admin/index', {path:"dashboard"});
        const catId = req.params.id;
        const cats = await Category.find().lean();

        Category.findById(catId).lean().then(cat => {
            res.render('admin/category/edit', {category: cat, categories: cats, path:"category"});
        });
    },

    editCategoriesPostRoute: async (req, res) => {
        const catId = req.params.id;
        const newTitle = req.body.name;

        if(newTitle) {
            Category.findById(catId).then(category => {
                category.title = newTitle;
                category.save().then(() => {
                    res.status(200).json({url: '/admin/category'});
                })
            })
        }
    },

    deleteCategory: (req, res) => {
        if(!pageRequiredLevel(3, req.user.level))
            return res.render('admin/index', {path:"dashboard"});
        Category.findByIdAndDelete(req.params.id).lean().then(deletedCategory => {
            req.flash('success-message', `The category (${deletedCategory.title}) has been deleted successfully.`);
            res.redirect('/admin/category');
        });
    },

    // COMMENT ROUTE SECTION
    getComments: (req, res) => {
        if(!pageRequiredLevel(1, req.user.level))
            return res.render('admin/index', {path:"dashboard"});
        Comment.find().lean()
            .populate('user')
            .then(comments => {
                res.render('admin/comments/index', {comments: comments, path:"comments"});
            });
    },

    updateComments: async (req, res) => {
        let commentId = req.body.id;
        let commentStatus = req.body.status;

        if(commentStatus) {
            Comment.findById(commentId).then(comment => {
                comment.commentIsApproved = commentStatus;
                comment.save().then(() => {
                    res.status(200).json({url: '/admin/comment'});
                })
            })
        }
    },

    deleteComment: (req, res) => {
        if(!pageRequiredLevel(1, req.user.level))
            return res.render('admin/index', {path:"dashboard"});
        Comment.findByIdAndDelete(req.params.id).lean().then(deletedComment => {
            req.flash('success-message', `The comment (${deletedComment.body}) has been deleted successfully.`);
            res.redirect('/admin/comment');
        });
    },

    // SETTING ROUTE SECTION
    getSettings: (req, res) => {
        if(!pageRequiredLevel(3, req.user.level))
            return res.render('admin/index', {path:"dashboard"});
        let themes = [];
        const themeNames = getThemes();

        themeNames.map((theme, index) => {
            themes.push({id: index, name: theme});
        });
        Setting.find().lean().then(settings => {
            
            res.render('admin/settings/index', {settings: settings[0], themeData: themes, path: 'settings', fs: fs});
        });
    },

    submitSettings: async (req, res) => {
        let settingApplied = req.body;
        if(!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            await file.mv('./public/images/favicon.ico', (error) => {
                if (error)
                    throw error;
            });
        }
        Setting.find().then(setting => {
            if(settingApplied.Theme_Have_Custom_settings === 'true') {
                console.log("Updated custom template setting!");
                let custom_theme_settings_location = `views/themes/${setting[0].websiteTheme}/settings/settings.json`;
                let content = JSON.parse(fs.readFileSync(custom_theme_settings_location, 'utf8'));
                content.template_logo_name = settingApplied.template_logo_name;
                fs.writeFileSync(custom_theme_settings_location, JSON.stringify(content, null, 2).concat('\n'));
            }
            setting[0].websiteName = settingApplied.website_name;
            setting[0].websiteCopyright =  settingApplied.copyright_text;
            setting[0].websiteTheme = settingApplied.website_theme;
            setting[0].websiteLanguage = settingApplied.website_language;
            setting[0].websiteTelegramURL = settingApplied.telegram_url;
            setting[0].websiteInstagramURL = settingApplied.instagram_url;
            setting[0].websiteGooglePlusURL = settingApplied.googleplus_url;
            setting[0].websiteTwitterURL = settingApplied.twitter_url;
            setting[0].websiteLinkedInURL = settingApplied.linkedin_url;
            setting[0].websiteFacebookURL = settingApplied.facebook_url;
            setting[0].websitePaginationLimit = settingApplied.pagination_limit;
            req.setLocale(setting[0].websiteLanguage);
            switch(setting[0].websiteLanguage) {
                case 'fa': {
                    setting[0].websiteDirection = 'rtl';
                    break;
                }
                case 'en': {
                    setting[0].websiteDirection = 'ltr';
                    break;
                }
                default: {
                    setting[0].websiteDirection = 'ltr';
                }
            }
            setting[0].save().then(() => {
                req.flash('success-message', 'Settings updated successfully.');
                res.redirect('/admin/settings');
            });
        });
    },

    getUsers: async (req, res) => {
        if(!pageRequiredLevel(3, req.user.level))
            return res.render('admin/index', {path:"dashboard"});
        User.find().lean().then(users => {
            res.render('admin/users/index', {users: users, path:"users"});
        });
    },

    editUser: (req, res) => {
        if(!pageRequiredLevel(3, req.user.level))
            return res.render('admin/index', {path:"dashboard"});
        const id = req.params.id;

        User.findById(id).lean()
            .then(users => {
                    res.render('admin/users/edit', {users: users, path:"users"});
            });
    },

    editUserSubmit: (req, res) => {
        const id = req.params.id;
        let newPassword = '';
        if(!isEmpty(req.body.password)) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    newPassword = hash;
                });
            });
        }

        User.findById(id)
            .then(user => {
                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
                user.email = req.body.email;
                user.level = req.body.level;
                if(!isEmpty(req.body.password))
                    user.password = newPassword;

                user.save().then(updateUser => {
                    req.flash('success-message', `The User ${updateUser.firstName} ${updateUser.lastName} has been updated.`);
                    res.redirect('/admin/users');
                });
            });
    },
};