import Profile from '../models/Profile.js';
import content from './content.js';

class ProfileController {

	async index(req, res) {
		const profile = await Profile.findAll({
			order: ['id'],
			where: { active: true }
		});
		return res.json(
			content(profile)
		);
  }

	async getById(req, res) {

		const profile = await Profile.findOne({ where: { id: req.params.id, active: true } });

		return res.status(200).json({
			profile,
		});
	}

	async store(req, res) {
		return res.json(await Profile.create(req.body));
	}

	async update(req, res) {

        const profile = await Profile.findByPk(req.params.id);

        if (!profile) {

            return res.status(404).json({ error: 'Profile not found!' });

        }

        return res.json(await profile.update(req.body));

    }

	async delete(req, res) {

		const profile = await Profile.findOne({ where: { id: req.params.id } });

		if (!profile)
		return res.status(400).json({ error: 'This Profile does not exists!' });

		await profile.update({ active: false });

		return res.status(200).json({ message: 'Profile successfully deleted!' });
	}
}

export default new ProfileController();
