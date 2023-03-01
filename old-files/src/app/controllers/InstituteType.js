import InstituteType from '../models/InstituteType.js';
import content from './content.js';

class InstituteTypeController {

	async index(req, res) {
		const instituteType = await InstituteType.findAll({
			order: ['id'],
			where: { active: true }
		});
		return res.json(
			content(instituteType)
		);
  }

	async getById(req, res) {

		const instituteType = await InstituteType.findOne({ where: { id: req.params.id, active: true } });

		return res.status(200).json({
			instituteType,
		});
	}

	async store(req, res) {
		return res.json(await InstituteType.create(req.body));
	}

	async update(req, res) {

        let data = req.body

        const instituteType = await InstituteType.findByPk(req.params.id);

        if (!instituteType ) {

            return res.status(404).json({ error: 'Institute Type not found!' });

        }

        return res.json(await instituteType.update(data));

    }

	async delete(req, res) {

		const instituteType = await InstituteType.findOne({ where: { id: req.params.id } });

		if (!instituteType)
		return res.status(400).json({ error: 'This Institute Type does not exists!' });

		await instituteType.update({ active: false });
		return res.status(200).json({ message: 'Institute Type successfully deleted!' });
	}
}

export default new InstituteTypeController();
