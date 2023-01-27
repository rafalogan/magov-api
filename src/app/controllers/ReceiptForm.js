import ReceiptForm from '../models/ReceiptForm.js';
import content from './content.js';


class ReceiptFormController {

	async index(req, res) {
		const receipt_form = await ReceiptForm.findAll({
			order: ['id'],
			where: {
				active: true
			}
		});

		return res.json(content(receipt_form));
	}

	async getById(req, res) {
		const receipt_form = await ReceiptForm.findOne({
			where: {
				id: req.params.id,
				active: true
			}
		});

		return res.status(200).json({
			receipt_form
		});
	}

	async store(req, res) {
		return res.json(await ReceiptForm.create(req.body));
	}
	async update(req, res) {

		const receipt_form = await ReceiptForm.findByPk(req.params.id);

		if (!receipt_form) {
			return res.status(404).json({
				error: 'Receipt Form not found!'
			});
		}

		return res.json(await receipt_form.update(req.body));
	}

	async delete(req, res) {

		const receipt_form = await ReceiptForm.findByPk(req.params.id);

		if (!receipt_form)
			return res.status(400).json({
				error: 'This Receipt Form does not exists!'
			});

		await receipt_form.update({
			active: false
		});

		return res.status(200).json({
			message: 'Receipt Form successfully deleted!'
		});
	}
}

export default new ReceiptFormController();
