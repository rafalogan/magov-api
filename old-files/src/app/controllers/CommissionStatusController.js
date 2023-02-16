import CommissionStatus from '../models/CommissionStatus.js';
import content from './content.js';

class CommissionStatusController {
    async store(req, res) {
        return res.json(await CommissionStatus.create(req.body));
    }

    async index(req, res) {
        const commissiontStatus = await CommissionStatus.findAll({
            order: ['id'],
            where: { active: true }
        });

        return res.json(content(commissiontStatus));
    }

    async getById(req, res) {
        const commissiontStatus = await CommissionStatus.findOne({
            where: { id: req.params.id, active: true }
        });

        if (!commissiontStatus) {
            return res
                .status(404)
                .json({ error: 'Commission status not found!' });
        }

        return res.status(200).json(content(commissiontStatus));
    }

    async update(req, res) {
        const commissiontStatus = await CommissionStatus.findByPk(
            req.params.id
        );

        if (!commissiontStatus) {
            return res
                .status(404)
                .json({ error: 'Commission status not found!' });
        }

        return res.json(await commissiontStatus.update(req.body));
    }

    async delete(req, res) {
        const commissiontStatus = await CommissionStatus.findOne({
            where: { id: req.params.id }
        });

        if (!commissiontStatus)
            return res
                .status(400)
                .json({ error: 'This commission status does not exists!' });

        await commissiontStatus.update({ active: false });

        return res
            .status(200)
            .json({ message: 'Commission status successfully deleted!' });
    }
}

export default new CommissionStatusController();
