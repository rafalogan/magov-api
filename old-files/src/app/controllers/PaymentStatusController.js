import PaymentStatus from '../models/PaymentStatus.js';
import content from './content.js';

class PaymentStatusController {
    async store(req, res) {
        return res.json(await PaymentStatus.create(req.body));
    }

    async index(req, res) {
        const paymentStatus = await PaymentStatus.findAll({
            order: ['id'],
            where: { active: true }
        });

        return res.json(content(paymentStatus));
    }

    async getById(req, res) {
        const paymentStatus = await PaymentStatus.findOne({
            where: { id: req.params.id, active: true }
        });

        if (!paymentStatus) {
            return res.status(404).json({ error: 'Payment status not found!' });
        }

        return res.status(200).json(content(paymentStatus));
    }

    async update(req, res) {
        const paymentStatus = await PaymentStatus.findByPk(req.params.id);

        if (!paymentStatus) {
            return res.status(404).json({ error: 'Payment status not found!' });
        }

        return res.json(await paymentStatus.update(req.body));
    }

    async delete(req, res) {
        const paymentStatus = await PaymentStatus.findOne({
            where: { id: req.params.id }
        });

        if (!paymentStatus)
            return res
                .status(400)
                .json({ error: 'This Profile does not exists!' });

        await paymentStatus.update({ active: false });

        return res
            .status(200)
            .json({ message: 'Payment status successfully deleted!' });
    }
}

export default new PaymentStatusController();
