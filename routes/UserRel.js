const express = require("express");
const { body } = require('express-validator');
const UserController = require("../controlers/User");

const router = express.Router();

router.get('/profile', UserController.getUserProfile);

router.post('/register', [ body('name' ,"Enter a Valid Name").isLength({ min: 3 }),
                            body('email' , "Enter a Valid E-mail").isEmail(),
                            body('password' , 'Password must be at least 5 characters').isLength({min:5}) 
] ,  UserController.registerUser);


router.post('/login', [ body('email' , "Enter a Valid E-mail").isEmail() 

] ,  UserController.loginUser);


router.post('/logout', UserController.logoutUser);


module.exports = router;
