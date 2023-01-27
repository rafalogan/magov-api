import Proposition from '../models/Proposition.js';
import PropositionTask from '../models/PropositionTask.js';
import Task from '../models/Task.js';
import TaskResponsible from '../models/TaskResponsible.js';
import content from './content.js';
import utils from './utils.js';

class PropositionTaskController {

	async index(req, res) {
		try {
			let include = [
				utils.include(Task, { active: true }, false, null,
					utils.include(TaskResponsible, { active: true }, false, null, null)
					),
				utils.include(Proposition, { active: true }, false, null, null)
			];

			const pt = await PropositionTask.findAll({
				order: [['created_at', 'DESC']],
				where: {active:true},
				include
			});
			return res.json(
				content(pt)
			);
		} catch (e) {
			console.error(e)
		}
	}
}

export default new PropositionTaskController();
