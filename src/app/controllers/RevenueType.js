import RevenueType from '../models/RevenueType.js';
import content from './content.js';

class RevenueTypeController {

	async index(req, res) {
		try{
			const revenue_type = await RevenueType.findAll({
				order: ['id'],
				where: {
					active: true
				}
			});
			return res.json(
				content(revenue_type)
			);

		}catch (e){
			console.log(e)
		}
	}

	async getById(req, res) {

		const revenue_type = await RevenueType.findOne({
			where: {
				id: req.params.id,
				active: true
			}
		});

		return res.status(200).json({
			revenue_type,
		});
	}

	async store(req, res) {
		return res.json(await RevenueType.create(req.body));
	}

	async update(req, res) {

		const revenue_type = await RevenueType.findByPk(req.params.id);

		if (!revenue_type) {
			return res.status(404).json({
				error: 'Revenue Type not found!'
			});
		}

		return res.json(await revenue_type.update(req.body));
	}

	async delete(req, res) {

		const revenue_type = await RevenueType.findByPk(req.params.id);

		if (!revenue_type)
			return res.status(400).json({
				error: 'This Revenue Type does not exists!'
			});

		await revenue_type.update({
			active: false
		});

		return res.status(200).json({
			message: 'Revenue Type successfully deleted!'
		});
	}
}

export default new RevenueTypeController();
