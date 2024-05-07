const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});

    if(candidate) {
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
        const tokenExpirationTime = 259200;

        if(passwordResult) {
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: tokenExpirationTime});

            res.status(200).json({
                message: 'Login success',
                token: `Bearer ${token}`
            });
        } else {
            res.status(401).json({
                message: 'User or password doesn\'t match'
            });
        }
    } else {
        res.status(404).json({
            message: 'User not found'
        });
    }
}

module.exports.register = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});

    if (candidate) {
        res.status(409).json({
            message: 'This email exist'
        });
    } else {
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        });

        try {
            await user.save();
            res.status(201).json({
                message: 'User create'
            });
        } catch (error) {
            errorHandler(res, error);
        }
    }
}