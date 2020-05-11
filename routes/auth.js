const express = require('express');

const User = require('../models/user')

const { check, body } = require('express-validator/check')

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/login',
    [
        body('email', 'Please enter a valid email')
        .isEmail()
        .normalizeEmail()
        ,
        body('password','Password is invalid')
        .isLength({min: 6})
        .isAlphanumeric()
        .trim()
    ]
    
    ,authController.postLogin);

router.post(
    '/signup',
    [
        check('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email')
        .custom((value , {req}) => {
        return User.findOne({email: value})
        .then(useDoc => {
            if(useDoc) {
                return Promise.reject('E-Mail already exists, please pick a different one')
            }
        })
    })
    ,
        body('password', 'Please enter a password with only numbers and text and at least 8 characters')
        .isLength({ min: 8})
        .isAlphanumeric()
        .trim(),
        body('confirmPassword')
        .trim()
        .custom ((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error('Passwords have to match')
            }
            return true;
        })
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
