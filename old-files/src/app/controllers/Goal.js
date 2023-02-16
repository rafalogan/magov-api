import Goal from '../models/Goal.js';
import content from './content.js';

class GoalController {

	async index(req, res) {
		const goal = await Goal.findAll({
			order: ['id'],
			where: { active: true }
		});
		return res.json(
			content(goal)
		);
  }

	async getById(req, res) {

		const goal = await Goal.findOne({ where: { id: req.params.id, active: true } });

		return res.status(200).json({
			goal,
		});
	}

	async store(req, res) {
		return res.json(await Goal.create(req.body));
	}

	async update(req, res) {

        let data = req.body

        const goal = await Goal.findByPk(req.params.id);

        if (!goal ) {

            return res.status(404).json({ error: 'Goal not found!' });

        }

        return res.json(await goal .update(data));

    }

	async delete(req, res) {

		const goal = await Goal.findOne({ where: { id: req.params.id } });

		if (!goal)
		return res.status(400).json({ error: 'This Goal does not exists!' });

		await goal.update({ active: false });

		return res.status(200).json({ message: 'Goal successfully deleted!' });
	}
}

export default new GoalController();
