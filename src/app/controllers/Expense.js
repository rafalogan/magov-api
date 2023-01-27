import Expense from '../models/Expense.js';
import content from './content.js';
import utils from './utils.js';
import ExpenseCompany from '../models/ExpenseCompany.js';
import ExpensePayment from '../models/ExpensePayment.js';
import ExpenseTypeExpense from '../models/ExpenseTypeExpense.js';
import database from '../../database/index.js';
import Company from '../models/Company.js';
import PaymentForm from '../models/PaymentForm.js';
import ExpenseType from '../models/ExpenseType.js';

const sequelize = database.connection;
class ExpenseController {

    async index(req, res) {

        let include = [
            utils.include(ExpenseCompany, {active: true}, false, null,
                utils.include(Company, {active: true})),

            utils.include(ExpensePayment, {active: true}, false, null,
                utils.include(PaymentForm, {active: true})),

            utils.include(ExpenseTypeExpense, {active: true}, false, null,
                utils.include(ExpenseType, {active: true}))
        ]
        const expense = await Expense.findAll({
            order: ['id'],
            where: {active: true},
            include
        });
        return res.json(
            content(expense)
        );
    }

    async getById(req, res) {
        let include = [
            utils.include(ExpenseCompany, {active: true}, false, null,
                utils.include(Company, {active: true})),

            utils.include(ExpensePayment, {active: true}, false, null,
                utils.include(PaymentForm, {active: true})),

            utils.include(ExpenseTypeExpense, {active: true}, false, null,
                utils.include(ExpenseType, {active: true}))
        ]
        const expense = await Expense.findOne({
            where: {
                id: req.params.id,
                active: true
            },
            include
        });

        return res.status(200).json({
            expense,
        });
    }

    async store(req, res) {
        let data = req.body
        let transaction = await sequelize.transaction();
        try {
            let expense_stored = await Expense.create(data, {
                transaction
            });

            if (data.ExpenseCompany) {
                await Promise.all(data.ExpenseCompany.map(async (value) => {
                     await ExpenseCompany.create({
                         expense: expense_stored.id,
                         company: value.company
                     },{transaction})
                }));
            }
            if (data.ExpensePayment) {
                await Promise.all(data.ExpensePayment.map(async (value) => {
                    await ExpensePayment.create({
                        expense: expense_stored.id,
                        payment_form: value.payment_form
                    },{transaction})
               }));
           }
            if (data.ExpenseTypeExpense) {
                await Promise.all(data.ExpenseTypeExpense.map(async (value) => {
                    await ExpenseTypeExpense.create({
                        expense: expense_stored.id,
                        type: value.type
                    },{transaction})
               }));
           }
           await transaction.commit();

            return res.json(expense_stored);
        } catch (error) {
            await transaction.rollback();
            console.log(error)
            return res.status(400).json({
                error: 'erro ao salvar registro'
            })
        }
    }

    async update(req, res) {

        const expense = await Expense.findByPk(req.params.id);

        if (!expense) {
            return res.status(404).json({
                error: 'Expense not found!'
            });
        }
        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            await Expense.update(data, {
                where: {id: req.params.id},
                transaction
            })

            if (data.ExpenseCompany) {
                await Promise.all(data.ExpenseCompany.map(async (value) => {
                    if (value.id) {
                        await ExpenseCompany.update(value, {where: {id: value.id},transaction})
                    } else {
                        await ExpenseCompany.create({
                            expense: expense_stored.id,
                            company: value.company
                        }, {transaction})}
                }));
            }
            if (data.ExpenseCompanyRemove) {
                await Promise.all(data.ExpenseCompanyRemove.map(async (value) => {
                    await ExpenseCompany.update({active: false}, {where: {id: value.id}, transaction})
                }));
            }

            if (data.ExpenseTypeExpense) {
                await Promise.all(data.ExpenseTypeExpense.map(async (value) => {
                    if (value.id) {
                        await ExpenseTypeExpense.update(value, {where: {id: value.id},transaction})
                    } else {
                        await ExpenseTypeExpense.create({
                            expense: expense_stored.id,
                            type: value.type
                        }, {transaction})}
                }));
            }
            if (data.ExpenseTypeExpenseRemove) {
                await Promise.all(data.ExpenseTypeExpenseRemove.map(async (value) => {
                    await ExpenseTypeExpense.update({active: false}, {where: {id: value.id}, transaction})
                }));
            }

            if (data.ExpensePayment) {
                await Promise.all(data.ExpensePayment.map(async (value) => {
                    if (value.id) {
                        await ExpensePayment.update(value, {where: {id: value.id},transaction})
                    } else {
                        await ExpensePayment.create({
                            expense: expense_stored.id,
                            payment_form: value.payment
                        }, {transaction})}
                }));
            }
            if (data.ExpensePaymentRemove) {
                await Promise.all(data.ExpensePaymentRemove.map(async (value) => {
                    await ExpensePayment.update({active: false}, {where: {id: value.id}, transaction})
                }));
            }

            await transaction.commit();
            return res.json({
                expense
            })
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            return res.status(400).json({
                error: 'Error when updating expense'
            })
        }
    }

    async delete(req, res) {

        const expense = await Expense.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!expense)
            return res.status(400).json({
                error: 'This Expense does not exists!'
            });

        await expense.update({
            active: false
        });
        return res.status(200).json({
            message: 'Expense successfully deleted!'
        });
    }
}

export default new ExpenseController();
