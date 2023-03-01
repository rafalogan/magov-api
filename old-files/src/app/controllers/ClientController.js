import Address from '../models/Address.js';
import Client from '../models/Clients.js';
import Contact from '../models/Contact.js';
import PaymentStatus from '../models/PaymentStatus.js';
import Product from '../models/Product.js';
import Purchases from '../models/Purchases.js';
import Seller from '../models/Seller.js';
import Unit from '../models/Unit.js';
import content from './content.js';

class ClientController {
    async store(req, res) {
        const { cpf_vendedor } = req.body;

        const clientExists = await Client.findOne({
            where: { cpf_vendedor, active: true }
        });

        if (clientExists) {
            return res.status(404).json({ error: 'Client already exists!' });
        }

        return res.json(await Client.create(req.body));
    }

    async index(req, res) {
        const clients = await Client.findAll({
            order: ['id'],
            where: { active: true }
        });

        return res.json(content(clients));
    }

    async getById(req, res) {
        const client = await Client.findOne({
            where: { id: req.params.id, active: true },
            include: [
                { model: Unit, where: { active: true },
                include: [
                    { model: Address, where: { active: true } },
                    { model: Contact, where: { active: true } }
                ],
            } 
            ],
        });

        if (!client) {
            return res.status(404).json({ error: 'Client not found!' });
        }

        return res.status(200).json(content(client));
    }

    async getByUnit(req, res) {
        const client = await Client.findOne({
            where: { unit: req.params.id, active: true }
        });

        if (!client) {
            return res.status(404).json({ error: 'Client not found!' });
        }

        return res.status(200).json(content(client));
    }

    async update(req, res) {
        const client = await Client.findByPk(req.params.id);

        if (!client) {
            return res.status(404).json({ error: 'Client not found!' });
        }

        return res.json(await client.update(req.body));
    }

    async delete(req, res) {
        const client = await Client.findOne({
            where: { id: req.params.id, active: true }
        });

        if (!client)
            return res
                .status(400)
                .json({ error: 'This client does not exists!' });

        await client.update({ active: false });

        return res
            .status(200)
            .json({ message: 'Client successfully deleted!' });
    }
}

export default new ClientController();
