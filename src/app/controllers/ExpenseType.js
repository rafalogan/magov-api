import ExpenseType from '../models/ExpenseType.js';
import content from './content.js';
import utils from './utils.js';
import database from '../../database/index.js';


class ExpenseTypeController {

	async index(req, res) {

		const expense_type = await ExpenseType.findAll({
			order: ['id'],
			where: {
				active: true
			}
		});

		return res.json(content(expense_type));
	}

	async getById(req, res) {
		const expense_type = await ExpenseType.findOne({
			where: {
				id: req.params.id,
				active: true
			}
		});

		return res.status(200).json({
			expense_type
		});
	}

	async store(req, res) {
		return res.json(await ExpenseType.create(req.body));
	}
	async update(req, res) {

		const expense_type = await ExpenseType.findByPk(req.params.id);

		if (!expense_type) {
			return res.status(404).json({
				error: 'Expense Type not found!'
			});
		}

		return res.json(await expense_type.update(req.body));
	}

	async delete(req, res) {

		const expense_type = await ExpenseType.findByPk(req.params.id);

		if (!expense_type)
			return res.status(400).json({
				error: 'This Expense Type does not exists!'
			});

		await expense_type.update({
			active: false
		});

		return res.status(200).json({
			message: 'Expense Type successfully deleted!'
		});
	}
}

export default new ExpenseTypeController();
