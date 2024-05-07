const Category = require('../models/Category');
const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler');
const moment = require('moment');
const {unlinkSync} = require("fs");

module.exports.getAll = async function (req, res) {
    try {
        const categories = await Category.find({user: req.user.id});
        res.status(200).json(categories);
    } catch (error) {
        errorHandler(res, error);
    }
}

module.exports.getById = async function (req, res) {
    try {
        const category = await Category.findById(req.params.id);
        res.status(200).json(category);
    } catch (error) {
        errorHandler(res, error);
    }
}

module.exports.remove = async function (req, res) {
    try {
        const category = await Category.findById(req.params.id);

        if (category.imageSrc) {
            try {
                unlinkSync(category.imageSrc);
            } catch (error) {
                console.error("Error deleting category image:", error);
            }
        }

        await category.deleteOne();

        await Position.deleteMany({category: req.params.id});

        res.status(200).json({
            message: 'Category have been deleted'
        });
    } catch (error) {
        errorHandler(res, error);
    }
}

module.exports.create = async function (req, res) {
    const date = moment().format('DDMMYYYY-HHmmss_SSS');

    try {
        const category = new Category({
            name: req.body.name,
            user: req.user.id,
            imageSrc: req.file ? req.file.path : ''
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.name === 1) {
            return res.status(400).json({ message: 'Category with this name already exists' });
        } else {
            errorHandler(res, error);
        }
    }
}

module.exports.update = async function (req, res) {
    const updated = {
        name: req.body.name
    }

    if (req.file) {
        updated.imageSrc = req.file.path;

        try {
            const existingCategory = await Category.findById(req.params.id);

            if (existingCategory.imageSrc) {
                try {
                    unlinkSync(existingCategory.imageSrc);
                } catch (error) {
                    console.error("Error deleting old image:", error);
                }
            }

            const category = await Category.findOneAndUpdate(
                {_id: req.params.id},
                {$set: updated},
                {new: true}
            );
            res.status(200).json(category);
        } catch (error) {
            errorHandler(res, error);
        }
    } else {
        try {
            const category = await Category.findOneAndUpdate(
                {_id: req.params.id},
                {$set: updated},
                {new: true}
            );
            res.status(200).json(category);
        } catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.name === 1) {
                return res.status(400).json({ message: 'Category with this name already exists' });
            } else {
                errorHandler(res, error);
            }
        }
    }
}

