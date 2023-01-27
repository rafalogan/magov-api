import DemandKeyword from '../models/DemandKeyword.js';
import content from './content.js';

class DemandKeywordController {

	async index(req, res) {
		const demand_key = await DemandKeyword.findAll({
			order: ['id'],
			where: { active: true }
		});
		return res.json(
			content(demand_key)
		);
  }

}

export default new DemandKeywordController();
