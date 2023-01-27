import Company from '../models/Company.js';
import content from './content.js';


class CompanyController {

	async index(req, res) {
		const companies = await Company.findAll({
			order: ['id'],
			where: { active: true }
		});
		return res.json(
			content(companies)
		);
	}

	async getById(req, res) {

		const company = await Company.findOne({ where: { id: req.params.id, active: true } });

		return res.status(200).json(
			content(company)
		);
	}

	async store(req, res) {
		let data = req.body;
        data.active = true;
        data.created_at = new Date();
        data.updated_at = new Date();
		return res.json(await Company.create(data));
	}

	async update(req, res) {
        const company = await Company.findByPk(req.body.id);
		if (!company) {
			return res.status(404).json({ error: 'Company not found!'});
		}
		return res.json(await company.update(req.body));
	}

	async delete(req, res) {

		const company = await Company.findOne({ where: { id: req.params.id } });

		if (!company)
			return res.status(400).json({ error: 'This Company does not exists!' });

		await company.update({ active: false });
		// await company.destroy();
		return res.status(200).json({ message: 'Company successfully deleted!' });
	}
}

export default new CompanyController();
