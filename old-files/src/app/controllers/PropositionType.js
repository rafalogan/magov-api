import PropositionType from '../models/PropositionType.js';
import content from './content.js';

class PropositionTypeController {

	async index(req, res) {
		const proposition_type = await PropositionType.findAll({
			order: ['id'],
			where: { active: true }
		});
		return res.json(
			content(proposition_type)
		);
  }

	async getById(req, res) {

		const proposition_type = await PropositionType.findOne({ where: { id: req.params.id, active: true } });

		return res.status(200).json({
			proposition_type,
		});
	}

	async store(req, res) {
		let data = req.body
		return res.json(await PropositionType.create(data));
	}

	async update(req, res) {
		let data = req.body;
		const proposition_type = await PropositionType.findByPk(req.params.id);

		if (!proposition_type) {
			return res.status(404).json({ error: 'Proposition Type not found!' });
		}


		return res.json(await proposition_type.update(data));
	}

	async delete(req, res) {

		const proposition_type = await PropositionType.findOne({ where: { id: req.params.id } });

		if (!proposition_type)
		return res.status(400).json({ error: 'This Proposition Type does not exists!' });

		await proposition_type.update({ active: false });

		return res.status(200).json({ message: 'Proposition Type successfully deleted!' });
	}
}

export default new PropositionTypeController();
