import Proposition from '../models/Proposition.js';
import PropositionRevenue from '../models/PropositionRevenue.js';
import Revenue from '../models/Revenue.js';
import content from './content.js';
import utils from './utils.js';

class PropositionRevenueController {
	async index(req, res) {
		try {
			let include =[
				utils.include(Revenue, { active: true }, false, null),
				utils.include(Proposition, { active: true }, false, null)
			]
			let where = {
				active: true
			}
			let order = ['created_at', 'DESC']
			const tkr = await PropositionRevenue.findAll({
				order: [order],
				where: where,
				include
			});
			return res.json(
				content(tkr)
			);
		} catch (e) {
			console.error(e)
		}
	}
}

export default new PropositionRevenueController();
