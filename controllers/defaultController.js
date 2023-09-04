const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const Comment = require('../models/CommentModel').Comment;
const User = require("../models/UserModel").User;
const bcrypt = require('bcryptjs');
const {Setting} = require("../models/SettingModel");
const fs = require("fs");
const {isEmpty} = require("../config/customFunction");
const {defaultPostIMG} = require("../config/configuration");
let profile_Err = [];
module.exports = {
    index: async (req, res) => {
        const categories = await Category.find().lean();
        const settings = await Setting.find().lean();
        Post.find({}).sort({$natural: -1}).lean().populate('user').then(data => {
            
            if(data.length === 0) {
                return res.render('index', {
                    posts: '',
                    catoLogPosts: '',
                    maxPages: '',
                    pages: '',
                    current_page: '',
                    categories: '',
                    path: 'home'
                });
            }
            let per_page = 5;
            let num_page = Number(req.params.page);
            if(!req.params.page)
                num_page = Number(1);
            let max_pages = Math.ceil(data.length/per_page);

            if(num_page === 0 || num_page > max_pages) {
                res.render('index', {posts: '', path: '', catoLogPosts: '', maxPages: '', current_page: ''});
            } else {
                let starting = per_page*(num_page-1)
                let ending = per_page+starting
                let pageNum = [];

                for(let i = 1; i <= max_pages; i++) {
                    pageNum.push(i);

                    if(i >= max_pages) {
                        res.render('index', {posts: data.slice(starting,ending),
                            catoLogPosts: data,
                            maxPages: max_pages,
                            pages: pageNum,
                            current_page: num_page,
                            categories: categories,
                            path: 'home'
                        });
                    }
                }
            }
        });
    },
    postInstallation: async (req, res) => {
        let DATA = req.body;
        if(DATA.website_name.length > 0 && DATA.copyright_text.length > 0) {
            Setting.find().lean().then(setting => {
                if (setting.length <= 0) {
                    const newSettings = new Setting({
                        websiteName: DATA.website_name,
                        websiteCopyright: DATA.copyright_text,
                        websiteLanguage: DATA.website_language,
                    });

                    newSettings.save().then(post => {
                        console.log('CMS installation complete!');
                        req.flash('success-message', 'CMS installation complete!');
                        res.redirect('/');
                    });
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/installation');
        }
    },
    indexPagination: async (req, res) => {
        const categories = await Category.find().lean();
        Post.find({}).sort({$natural: -1}).lean().populate('user').then((data)=>{
            let per_page = 5;
            let num_page = Number(req.params.page);
            let max_pages = Math.ceil(data.length/per_page);
            if(num_page === 0 || num_page > max_pages){
                res.render('index', {posts: ''});
            }else{
                let starting = per_page*(num_page-1)
                let ending = per_page+starting
                let pageNum = [];

                for(let i = 1; i <= max_pages; i++) {
                    pageNum.push(i);

                    if(i >= max_pages)
                    {
                        res.render('index', {posts:data.slice(starting,ending),
                            catoLogPosts: data,
                            maxPages: max_pages,
                            pages: pageNum,
                            current_page: num_page,
                            categories: categories,
                            path: 'home'
                            });
                    }
                }
            }
        });
    },

    loginGet: (req, res) => {
        res.render('login', {path: 'login'});
    },

    loginPost: (req, res) => {
        res.send("Congratulations, you've successfully submitted the data");
    },

    registerGet: (req, res) => {
        res.render('register', {path: 'register', errors: ''});
    },

    resultGet: async (req, res) => {
        res.render('index', {path: 'home', searchQuery: '', catoLogPosts: ''});
    },

    resultPost: async (req, res) => {
        let searchText = req.body.search_text;
        const categories = await Category.find().lean();
        Post.find({}, (err, foundPosts) => {
            if(err)
                return err;
            else
            {
                if(foundPosts.length === 0) {
                    return res.render('index', {
                        posts: '',
                        catoLogPosts: '',
                        maxPages: '',
                        pages: '',
                        current_page: '',
                        selectedPosts: '',
                        categories: '',
                        path: 'home',
                        searchQuery: searchText + "\n\n<h1>there is nothing to show</h1>"
                    });
                    
                }
                let newPostsData = [];
                for(let index = 0; index < foundPosts.length; index++)
                {
                    if(foundPosts[index].title.includes(searchText) || foundPosts[index].description.includes(searchText) || foundPosts[index].description_more.includes(searchText)) {

                        newPostsData.push(foundPosts[index]);
                    }
                    else {
                        if(index === foundPosts.length - 1) {
                            Post.find().lean().populate('user')
                                .then(data => {
                                    res.render('index', {
                                        catoLogPosts: data,
                                        categories: categories,
                                        path: 'home',
                                        selectedPosts: '',
                                        searchQuery: searchText + "\n\n<h1>there is nothing to show</h1>"
                                    });
                                });
                        }
                    }
                    if(index === foundPosts.length - 1) {
                        Post.find().lean().populate('user')
                            .then(data => {
                                res.render('index', {
                                    catoLogPosts: data,
                                    selectedPosts: newPostsData.map(post => post.toJSON()),
                                    path: 'home',
                                    categories: categories,
                                    searchQuery: searchText
                                });
                            });
                    }
                }
            }
        }).sort({$natural: -1}).populate('user');
    },

    resultCatGet: async (req, res) => {
        const catLooking = req.params.cat;
        const categories = await Category.find().lean();
        const AllPosts = await Post.find().lean();
        Post.find({category: catLooking}, (err, foundPosts) => {
            if (err)
                return err;
            else {
                if(foundPosts.length)
                {
                    let newPostsData = [];
                    for (let index = 0; index < foundPosts.length; index++) {
                        newPostsData.push(foundPosts[index]);
                        if (index === foundPosts.length - 1) {
                            categories.map(cat => {
                                if(cat.title === catLooking)
                                    res.render('index', {selectedPosts: newPostsData.map(post => post.toJSON()), path: 'home', catoLogPosts: AllPosts, categories: categories, searchQuery: cat.title});
                            });
                        }
                    }
                }
                else {
                    res.render('index', {categories: categories, selectedPosts: '', path: 'home', catoLogPosts: AllPosts, searchQuery: catLooking + "\n\n<h1>there is nothing to show</h1>"});
                }
            }
        }).sort({$natural: -1}).populate('user');
    },

    resultUserGet: async (req, res) => {
        const userId = req.params.id;
        const categories = await Category.find().lean();
        const users = await User.find().lean();
        const AllPosts = await Post.find().lean();
        const ObjectId = require('mongoose').Types.ObjectId;
            Post.find({user: new ObjectId(userId)}, (err, foundPosts) => {
            if (err)
                return err;
            else {
                if(foundPosts.length)
                {
                    let newPostsData = [];
                    for (let index = 0; index < foundPosts.length; index++) {
                        newPostsData.push(foundPosts[index]);
                        if (index === foundPosts.length - 1) {
                            users.map(user => {
                                if(user._id == userId) {
                                    res.render('index', {
                                        selectedPosts: newPostsData.map(post => post.toJSON()),
                                        user: user,
                                        categories: categories,
                                        searchQuery: `${user.firstName} ${user.lastName}`,
                                        path: 'home'
                                    });
                                }
                            });
                        }
                    }
                }
                else {
                    res.render('index', {categories: categories, path: 'home', catoLogPosts: AllPosts, searchQuery: Post[0].user.firstName + " " + Post[0].user.lastName + "\n\n<h1>there is nothing to show</h1>"});
                }
            }
        }).sort({$natural: -1}).populate('user');
    },

    registerPost: (req, res) => {
        let errors = [];

        if(!req.body.firstName) {
            errors.push({message: 'First name is mandatory'});
        }
        if(!req.body.lastName) {
            errors.push({message: 'Last name is mandatory'});
        }
        if(!req.body.email) {
            errors.push({message: 'Email name is mandatory'});
        }
        if (!req.body.password || !req.body.passwordConfirm) {
            errors.push({message: 'Password field is mandatory'});
        }
        if (req.body.password !== req.body.passwordConfirm) {
            errors.push({message: 'Passwords do not match'});
        }

        if(errors.length > 0) {
            res.render('register', {
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                avatar: 'def_avatar.png'
            });
        }
        else
        {
            User.findOne({email: req.body.email}).lean().then( user => {
                if(user) {
                    req.flash('error-message', 'Email already exists, try to login.');
                    res.redirect('/login');
                } else {
                    User.findOne({email: req.body.email}).then(user => {
                        if (user) {
                            req.flash('error-message', 'Email already exists, try to login.');
                            res.redirect('/login');
                        } else {
                            const newUser = new User(req.body);

                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    newUser.password = hash;
                                    newUser.save().then(user => {
                                        req.flash('success-message', 'You are now registered');
                                        res.redirect('/login');
                                    });
                                });
                            });
                        }
                    });
                }
            });
        }
    },

    getSinglePost: async (req, res) => {
        const id = req.params.id;
        const categories = await Category.find().lean();
        Post.findById(id).lean().populate('user')
            .populate({path: 'comments', populate: {path: 'user', model: 'user'}})
            .then(post => {
                if (!post) {
                    res.status(404).json({message: 'No Post Found'});
                }
                else {
                    Post.find().lean().sort({$natural: -1}).populate('user')
                        .then(data => {
                            res.set('Content-Type', 'text/html');
                            res.render('index', {post: post, comments: post.comments, categories: categories, catoLogPosts: data, path: 'home'});
                        });

                }
            })
    },

    submitComment: (req, res) => {

        if (req.user) {
            Post.findOne({_id: req.body.id}, function (err, post) {
                if (err) return done(err);
                const newComment = new Comment({
                    user: req.user.id,
                    body: req.body.comment_body
                });
                post.comments.push(newComment);
                post.save().then(savedPost => {
                    newComment.save().then(savedComment => {
                        req.flash('success-message', 'Your comment was submitted for review.');
                        res.redirect(`/post/${post._id}`);
                    });
                });
            });
        }

        else {
            req.flash('error-message', 'Login first to comment');
            res.redirect('/login');
        }

    },

    // Profile Route Setup
    getProfile: (req, res) => {
        if (req.user) {
            if(profile_Err[0] === undefined)
            { 
                res.render('profile', {path: 'profile', profile_Errors: ''});
            }
            else
            {
                res.render('profile', {path: 'profile', profile_Errors: profile_Err[0]});
            }
        }
        else {
            req.flash('error-message', 'Login first to see profile');
            res.redirect('/login');
        }
    },
    submitProfile: (req, res) => {
        let DATA = req.body;
        let postImgPath = 'def_avatar.png';
        let uploaded_filename = '';
        let _FinalAvatarName = '';
        let fileExt = '';
        if(!isEmpty(req.files)) {
            let file = req.files.user_avatar;
            uploaded_filename = file.name;
            let fileName = uploaded_filename;
            let arr = fileName.split('.');
            let extensionName = arr[arr.length-1];
            fileExt = extensionName;
            let uploadDir = './public/uploads/avatars/';
            postImgPath = `${uploaded_filename}`;
            file.mv(uploadDir + uploaded_filename, (error) => {
                if (error)
                    throw error;

                fs.rename(uploadDir +'/'+ postImgPath,uploadDir +'/'+ DATA.user_id + '.' + fileExt, function (error) {
                    if (error) {
                        fs.unlink(uploadDir +'/'+ DATA.user_id + '.jpg');
                        fs.unlink(uploadDir +'/'+ DATA.user_id + '.jpeg');
                        fs.unlink(uploadDir +'/'+ DATA.user_id + '.png');
                        fs.rename(uploadDir +'/'+ postImgPath,uploadDir +'/'+ DATA.user_id + '.' + fileExt);
                    }
                });
            });
        }

        User.findById(DATA.user_id)
            .then(user => {
                user.firstName = DATA.first_name;
                user.lastName = DATA.last_name;
                user.phoneNumber = DATA.phone_number;
                user.websiteAddress = DATA.website_address;
                user.aboutUser = DATA.about_user;

                if(!isEmpty(req.files)) {
                    _FinalAvatarName = DATA.user_id + '.' + fileExt;
                    if (!isEmpty(_FinalAvatarName) && fileExt !== undefined) {
                        user.avatar = _FinalAvatarName;
                    }
                }
                user.save().then(updatedUser => {
                    profile_Err = [];
                    profile_Err.push({message: 'Your profile has been update.'});
                    console.log(`The User ${updatedUser.firstName} profile has been updated.`);
                    req.flash('success-message', `Your profile has been update.`);
                    res.redirect('/profile');
                });
            });
    }
};
async function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }