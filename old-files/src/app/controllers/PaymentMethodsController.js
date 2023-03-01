import PaymentMethods from '../models/PaymentMethods.js';
import content from './content.js';

class PaymentMethodsController {
    async store(req, res) {
        return res.json(await PaymentMethods.create(req.body));
    }

    async index(req, res) {
        const paymentMethod = await PaymentMethods.findAll({
            order: ['id'],
            where: { active: true }
        });

        return res.json(content(paymentMethod));
    }

    async getById(req, res) {
        const paymentMethod = await PaymentMethods.findOne({
            where: { id: req.params.id, active: true }
        });

        if (!paymentMethod) {
            return res.status(404).json({ error: 'Payment Method not found!' });
        }

        return res.status(200).json(content(paymentMethod));
    }

    async update(req, res) {
        const paymentMethod = await PaymentMethods.findByPk(req.params.id);

        if (!paymentMethod) {
            return res.status(404).json({ error: 'Payment Method not found!' });
        }

        return res.json(await paymentMethod.update(req.body));
    }

    async delete(req, res) {
        const paymentMethod = await PaymentMethods.findOne({
            where: { id: req.params.id }
        });

        if (!paymentMethod)
            return res
                .status(400)
                .json({ error: 'This Payment Method does not exists!' });

        await paymentMethod.update({ active: false });

        return res
            .status(200)
            .json({ message: 'Payment Method successfully deleted!' });
    }
}

export default new PaymentMethodsController();
