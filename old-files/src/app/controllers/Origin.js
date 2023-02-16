import Origin from '../models/Origin.js';
import content from './content.js';

class OriginController {

    async index(req, res) {
        const origin = await Origin.findAll({
            order: ['id'],
            where: { active: true },
        });

        return res.json(
            content(origin)
        )
    }

    async getById(req, res) {

        const origin = await Origin.findOne({ where: { id: req.params.id, }})

        return res.status(200).json({
            origin,
        })
    }

    async store(req, res) {
        let data = req.body;
        return res.json(await Origin.create(data));
    }

    async update(req, res) {
        let data = req.body;
        const origin = await Origin.findOne({where: {id: req.params.id}});

        if(!origin) {
            return res.status(404).json({ error: 'Origin not found!'});
        }

        return res.json(await origin.update(data));
    }

    async delete(req, res) {
        const origin = await Origin.findOne({ where: { id: req.params.id}});

        if(!origin) {
            return res.status(400).json({ error: 'This Origin not exist!'});
        }

        await origin.update({ active: false});

        return res.status(400).json({ message: 'Origin successfully deleted!'})
    }
}

export default new OriginController();
