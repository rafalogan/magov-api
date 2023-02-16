import Seller from '../models/Seller.js';
import content from './content.js';

class SellerController {
    async store(req, res) {
        const { cpf_vendedor } = req.body;

        const sellerExists = await Seller.findOne({
            where: { cpf_vendedor, active: true }
        });

        if (sellerExists) {
            return res.status(404).json({ error: 'Seller already exists!' });
        }

        return res.json(await Seller.create(req.body));
    }

    async index(req, res) {
        const seller = await Seller.findAll({
            order: ['id'],
            where: { active: true }
        });

        return res.json(content(seller));
    }

    async getById(req, res) {
        const seller = await Seller.findOne({
            where: { id: req.params.id, active: true }
        });

        if (!seller) {
            return res.status(404).json({ error: 'Seller not found!' });
        }

        return res.status(200).json(content(seller));
    }

    async update(req, res) {
        const seller = await Seller.findByPk(req.params.id);

        if (!seller) {
            return res.status(404).json({ error: 'Seller not found!' });
        }

        return res.json(await seller.update(req.body));
    }

    async delete(req, res) {
        const seller = await Seller.findOne({
            where: { id: req.params.id }
        });

        if (!seller)
            return res
                .status(400)
                .json({ error: 'This Seller does not exists!' });

        await seller.update({ active: false });

        return res
            .status(200)
            .json({ message: 'Seller successfully deleted!' });
    }
}

export default new SellerController();
