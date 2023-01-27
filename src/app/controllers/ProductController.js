import Product from '../models/Product.js';
import content from './content.js';

class ProductController {
    async store(req, res) {
        const { due_date } = req.body;

        let todayDate = new Date();
        let dueDate = new Date(due_date);
        let newDueDate;
        const verifyDate = dueDate.getTime() < todayDate.getTime();

        if (verifyDate) {
            return res.status(400).json({
                error: 'The due date cannot be less than the current date!'
            });
        }

        if (due_date == '' || due_date == undefined) {
            const emptyDate = todayDate.setDate(todayDate.getDate() + 30);
            newDueDate = new Date(emptyDate);

            const newProduct = {
                ...req.body,
                due_date: newDueDate
            };
            return res.json(await Product.create(newProduct));
        }

        return res.json(await Product.create(req.body));
    }

    async index(req, res) {
        const products = await Product.findAll({
            order: ['id'],
            where: { active: true }
        });

        return res.json(content(products));
    }

    async getById(req, res) {
        const product = await Product.findOne({
            where: { id: req.params.id, active: true }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found!' });
        }

        return res.status(200).json(content(product));
    }

    async update(req, res) {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found!' });
        }

        const { due_date } = req.body;
        let todayDate = new Date();
        let dueDate = new Date(due_date);
        const verifyDate = dueDate.getTime() < todayDate.getTime();

        if (verifyDate) {
            return res.status(400).json({
                error: 'The due date cannot be less than the current date!'
            });
        }

        if (!due_date) {
            return res.status(400).json({
                error: 'Date is invalid!'
            });
        }

        return res.json(await product.update(req.body));
    }

    async delete(req, res) {
        const product = await Product.findOne({
            where: { id: req.params.id }
        });

        if (!product)
            return res
                .status(400)
                .json({ error: 'This Product does not exists!' });

        await product.update({ active: false });

        return res
            .status(200)
            .json({ message: 'Product successfully deleted!' });
    }
}

export default new ProductController();
