const Position = require('../models/Position');
const errorHandler = require('../utils/errorHandler');

module.exports.getByCategoryId = async function (req, res) {
    try {
        const position = await Position.find({
            category: req.params.categoryId,
            user: req.user.id
        });
        res.status(200).json(position);
    } catch (error) {
        errorHandler(res, error);
    }
}

module.exports.create = async function (req, res) {
    try {
        const position = await new Position({
            name: req.body.name,
            cost: req.body.cost,
            category: req.body.category,
            user: req.user.id
        });
        await position.save();
        res.status(201).json({
            message: 'Position created',
            position: position
        });
    } catch (error) {
        errorHandler(res, error);
    }
}

module.exports.remove = async function (req, res) {
    try {
        await Position.deleteOne({_id: req.params.id});
        res.status(200).json({
            message: 'Position remove'
        });
    } catch (error) {
        errorHandler(res, error);
    }
}

module.exports.update = async function (req, res) {
    try {
        const position = await Position.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
            );
        res.status(200).json({
            message: 'Position update',
            position: position
        });
    } catch (error) {
        errorHandler(res, error);
    }
}