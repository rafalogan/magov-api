import PaymentForm from '../models/PaymentForm.js';
import content from './content.js';

class PaymentFormController {

	async index(req, res) {

		const payment_form = await PaymentForm.findAll({
			order: ['id'],
			where: {
				active: true
			}
		});

		return res.json(content(payment_form));
	}

	async getById(req, res) {
		const payment_form = await PaymentForm.findOne({
			where: {
				id: req.params.id,
				active: true
			}
		});

		return res.status(200).json({
			payment_form
		});
	}

	async store(req, res) {
		return res.json(await PaymentForm.create(req.body));
	}
	async update(req, res) {

		const payment_form = await PaymentForm.findByPk(req.params.id);

		if (!payment_form) {
			return res.status(404).json({
				error: 'Payment Form not found!'
			});
		}

		return res.json(await payment_form.update(req.body));
	}

	async delete(req, res) {

		const payment_form = await PaymentForm.findByPk(req.params.id);

		if (!payment_form)
			return res.status(400).json({
				error: 'This Payment Form does not exists!'
			});

		await payment_form.update({
			active: false
		});

		return res.status(200).json({
			message: 'Payment Form successfully deleted!'
		});
	}
}

export default new PaymentFormController();
