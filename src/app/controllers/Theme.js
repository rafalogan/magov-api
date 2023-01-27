import Theme from '../models/Theme.js';
import content from './content.js';

class ThemeController {

	async index(req, res) {
		const theme = await Theme.findAll({
			order: ['id'],
			where: {
				active: true
			}
		});
		return res.json(
			content(theme)
		);
	}

	async getById(req, res) {

		const theme = await Theme.findOne({
			where: {
				id: req.params.id,
				active: true
			}
		});

		return res.status(200).json({
			theme,
		});
	}

	async store(req, res) {
		return res.json(await Theme.create(req.body));
	}

	async update(req, res) {

		const theme = await Theme.findByPk(req.params.id);

		if (!theme) {
			return res.status(404).json({
				error: 'Theme not found!'
			});
		}

		return res.json(await theme.update(req.body));
	}

	async delete(req, res) {

		const theme = await Theme.findByPk(req.params.id);

		if (!theme)
			return res.status(400).json({
				error: 'This Theme does not exists!'
			});

		await theme.update({
			active: false
		});

		return res.status(200).json({
			message: 'Theme successfully deleted!'
		});
	}
}

export default new ThemeController();
