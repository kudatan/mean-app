const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async function (req, res) {
    const query = {
        user: req.user.id
    };

    if (req.query.start) {
        query.date = {
            $gte: req.query.start
        }
    }

    if (req.query.end) {
        if (!query.date) {
            query.date = {}
        }

        query.date['$lte'] = req.query.end;
    }

    if (req.query.order) {
        query.order = +req.query.order;
    }

    try {
        const [orders, total] = await Promise.all([
            Order.find(query)
                .sort({date: -1})
                .skip(+req.query.offset)
                .limit(+req.query.limit),
            Order.countDocuments(query)
        ]);

        const meta = {
            totalCount: total
        };

        res.status(200).json({ orders, meta });
    } catch (error) {
        errorHandler(res, error);
    }
}

module.exports.create = async function (req, res) {
    try {
        const lastOrder = await Order
            .findOne({user: req.user.id})
            .sort({date: -1});

        const maxOrder = lastOrder ? lastOrder.order : 0;

        const order = await new Order({
            list: req.body.list,
            user: req.user.id,
            order: maxOrder + 1
        });
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        errorHandler(res, error);
    }
}