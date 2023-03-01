import Contact from '../models/Contact.js';
import content from './content.js';

class ContactController {

    async index(req, res) {
        const contact = await Contact.findAll({
            order: ['id'],
            where: { active: true },
        });

        return res.json(
            content(contact)
        )
    }

    async getById(req, res) {

        const contact = await Contact.findOne({ where: { id: req.params.id, }})

        return res.status(200).json({
            contact,
        })
    }

    async store(req, res) {
        let data = req.body;
        return res.json(await Contact.create(data));
    }

    async update(req, res) {
        let data = req.body;
        const contact = await Contact.findOne({where: {id: req.params.id}});

        if(!contact) {
            return res.status(404).json({ error: 'Contact not found!'});
        }

        return res.json(await contact.update(data));
    }

    async delete(req, res) {
        const contact = await Contact.findOne({ where: { id: req.params.id}});

        if(!contact) {
            return res.status(400).json({ error: 'This Contact not exist!'});
        }

        await contact.update({ active: false});

        return res.status(400).json({ message: 'Contact successfully deleted!'})
    }
}

export default new ContactController();
