import { Op } from 'sequelize';
import Demand from '../models/Demand.js';
import DemandKeyword from '../models/DemandKeyword.js';
import DemandTask from '../models/DemandTask.js';
import Person from '../models/Person.js';
import PhysicalPerson from '../models/PhysicalPerson.js';
import Proposition from '../models/Proposition.js';
import Propositionkeyword from '../models/PropositionKeyword.js';
import PropositionTask from '../models/PropositionTask.js';
import Task from '../models/Task.js';
import TaskResponsible from '../models/TaskResponsible.js';
import User from '../models/User.js';
import content from './content.js';
import utils from './utils.js';

class TaskResponsiblesController {

	async index(req, res) {
		try {
			// let include = [];
			let include = [
				utils.include(Task, { active: true }, false, null, [
					utils.include(DemandTask, { active: true }, false, null,
						utils.include(Demand, { active: true }, false, null, null)),
					utils.include(PropositionTask, { active: true }, false, null,
						utils.include(Proposition, { active: true }, false, null, null)),
				]),
				utils.include(PhysicalPerson, { active: true }, false, null,
					utils.include(Person, { active: true }, false, null, null)),
			];

			let start = req.query.start ? req.query.start.replace(/T[0-9][0-9]/i, "T00") : null;
			let end = req.query.end ? req.query.end.replace(/T[0-9][0-9]/i, "T23") : null;
			let dateWhere = null;

			if (start && end) {
				dateWhere = {
					[Op.between]: [start, end]
				};
			} else if (start && !end) {
				dateWhere = {
					[Op.gte]: start
				};
			} else if (!start && end) {
				dateWhere = {
					[Op.lte]: end
				}
			}

			let where = {
				active: true
			}
			let order = ['created_at', 'DESC']


			if (dateWhere) {
				where[Op.or] = [{
					created_at: dateWhere
				}]
			}

			let unitWhere = req.query.unit;
			if (unitWhere) {
				include.push(utils.include(Task, { active: true, unit: unitWhere }, true, null))
			} else {
				include.push(utils.include(Task, { active: true }, true, null))
			}

			let workWhere;
			if (req.query.workP) {
				workWhere = req.query.workP;
				include.push(utils.include(Task, { active: true }, true, null,
					utils.include(PropositionTask, { active: true, proposition: workWhere }, true, null, null,)
				))
			} else if (req.query.workD) {
				workWhere = req.query.workD;
				include.push(utils.include(Task, { active: true }, true, null,
					utils.include(DemandTask, { active: true, demand: workWhere }, true, null, null,)
				))
			}

			let keywordWhere = req.query.keyword;
			if (keywordWhere) {
				const proposition = await Proposition.findOne({
					where: {
						title: { [Op.regexp]: keywordWhere },
						active: true
					},
				})
				if (proposition) {
					include.push(utils.include(Task, { active: true }, true, null,
						utils.include(PropositionTask, { active: true }, true, null,
							utils.include(Proposition, { active: true, title: { [Op.regexp]: keywordWhere } }, true, null, null)),
					))
				} else {
					const demand = await Demand.findOne({
						where: {
							name: { [Op.regexp]: keywordWhere },
							active: true
						},
					})

					if (demand) {
						include.push(utils.include(Task, { active: true }, true, null,
							utils.include(DemandTask, { active: true }, true, null,
								utils.include(Demand, { active: true, name: { [Op.regexp]: keywordWhere } }, true, null, null))
						))
					}
				}
			}
			let titleWhere = req.query.keytTitle;
			if (titleWhere) {
				include.push(utils.include(Task, { active: true,  title: { [Op.regexp]: titleWhere } }, true, null, null))
			}

			let eventsWhere = req.query.events;
			if (eventsWhere) {
				include.push(utils.include(Task, { active: true, event: true }, true, null))
			} else {
				include.push(utils.include(Task, { active: true }, true, null))
			}

			let createdByWhere = req.query.createdBy;
			if (createdByWhere) {
				include.push(utils.include(Task, { active: true, created_by: createdByWhere }, true, null))
			} else {
				include.push(utils.include(Task, { active: true }, true, null))
			}

			const tkr = await TaskResponsible.findAll({
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

export default new TaskResponsiblesController();
