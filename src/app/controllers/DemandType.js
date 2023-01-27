import DemandType from '../models/DemandType.js';
import content from './content.js';

class DemandTypeController {

	async index(req, res) {
		const demand_type = await DemandType.findAll({
			order: ['id'],
			where: { active: true }
		});
		return res.json(
			content(demand_type)
		);
  }

	async getById(req, res) {

		const demand_type = await DemandType.findOne({ where: { id: req.params.id, active: true } });

		return res.status(200).json({
			demand_type,
		});
	}

	async store(req, res) {
		return res.json(await DemandType.create(req.body));
	}

	async update(req, res) {
		let data = req.body
		const demand_type = await DemandType.findByPk(req.params.id);

		if (!demand_type) {
			return res.status(404).json({ error: 'Demand Type not found!' });
		}


		return res.json(await demand_type.update(data));
	}

	async delete(req, res) {

		const demand_type = await DemandType.findOne({ where: { id: req.params.id } });

		if (!demand_type)
		    return res.status(400).json({ error: 'This Demand Type does not exists!' });

		await demand_type.update({ active: false });
		    return res.status(200).json({ message: 'Demand Type successfully deleted!' });
	}
}

export default new DemandTypeController();
