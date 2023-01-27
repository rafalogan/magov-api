import { Op } from 'sequelize';
import database from '../../database/index.js';
import utils from './utils.js';
import content from './content.js';
import Proposition from '../models/Proposition.js';
import PropositionDemand from '../models/PropositionDemand.js';
import PropositionDocument from '../models/PropositionDocument.js';
import PropositionGoal from '../models/PropositionGoal.js';
import Propositionkeyword from '../models/PropositionKeyword.js';
import PropositionRelated from '../models/PropositionRelated.js';
import PropositionTask from '../models/PropositionTask.js';
import PropositionTheme from '../models/PropositionTheme.js';
import PropositionType from '../models/PropositionType.js';
import PhysicalPerson from '../models/PhysicalPerson.js';
import Person from '../models/Person.js';
import PropositionTypeProposition from '../models/PropositionTypeProposition.js';
import Task from '../models/Task.js';
import Theme from '../models/Theme.js';
import TaskResponsible from '../models/TaskResponsible.js';
import Plaintiff from '../models/Plaintiff.js';
import RevenueOrigin from '../models/RevenueOrigin.js';
import Revenue from '../models/Revenue.js';
import User from '../models/User.js';
import Unit from '../models/Unit.js';
import Address from '../models/Address.js';
import PropositionRevenue from '../models/PropositionRevenue.js';
import Expense from '../models/Expense.js';
import Origin from '../models/Origin.js';

function adicionaZero(numero) {
    if (numero <= 9)
        return "0" + numero;
    else
        return numero;
}
const sequelize = database.connection;
let include = [
    utils.include(PropositionTheme, { active: true }, false, null,
        utils.include(Theme, { active: true }, false, null, null)),
        utils.include(PropositionTask, { active: true }, false, null, [
            utils.include(Task, { active: true }, true, null, [
                utils.include(TaskResponsible, { active: true }, false, null,
                    utils.include(PhysicalPerson, { active: true }, false, null,
                        utils.include(Person, { active: true }, false, null, null))),
                utils.include(Theme, { active: true }, false, null)

            ]),
            utils.include(Proposition, { active: true }, true, null, null),
        ]),
    utils.include(PropositionRevenue, { active: true }, false, null, [
        utils.include(Revenue, { active: true }, false, null, null),
    ]),
    utils.include(PropositionDemand, { active: true }),
    utils.include(Expense, { active: true }, false, null, [
        utils.include(RevenueOrigin, { active: true }, false, null, [
            utils.include(Origin, { active: true }, false, null, null),
        ]),
        utils.include(Unit, { active: true }, false, null, null),
    ]),
    utils.include(PropositionDocument, { active: true }),
    utils.include(PropositionGoal, { active: true }),
    utils.include(Propositionkeyword, { active: true }),
    utils.include(PropositionRelated, { active: true }),
    utils.include(PropositionTypeProposition, { active: true }, false, null,
        utils.include(PropositionType, { active: true }, false, null, null)),
    utils.include(PhysicalPerson, { active: true }, false, null,
        utils.include(Person, { active: true }, false, null, null)),
    utils.include(Revenue, { active: true }, false, null, [
        utils.include(RevenueOrigin, { active: true }, false, null, null),
        utils.include(Unit, { active: true }, false, null, null),
    ]),
    utils.include(User, { active: true }, false, null,
        utils.include(PhysicalPerson, { active: true }, false, null,
            utils.include(Person, { active: true }), 'pf'
        )
    )
];
class PropositionController {
    async index(req, res) {
        try {
            include = [];
            include = [
                utils.include(PropositionTheme, { active: true }, false, null,
                    utils.include(Theme, { active: true }, false, null, null)),
                utils.include(PropositionTask, { active: true }, false, null, [
                    utils.include(Task, { active: true }, true, null, [
                        utils.include(TaskResponsible, { active: true }, false, null,
                            utils.include(PhysicalPerson, { active: true }, false, null,
                                utils.include(Person, { active: true }, false, null, null))),
                        utils.include(Theme, { active: true }, false, null)

                    ]),
                    utils.include(Proposition, { active: true }, true, null, null),
                ]),
                utils.include(PropositionRevenue, { active: true }, false, null, [
                    utils.include(Revenue, { active: true }, false, null, null),
                ]),
                utils.include(Expense, { active: true }, false, null, [
                    utils.include(RevenueOrigin, { active: true }, false, null, [
                        utils.include(Origin, { active: true }, false, null, null),
                    ]),
                    utils.include(Unit, { active: true }, false, null, null),
                ]),
                utils.include(PropositionDemand, { active: true }),
                utils.include(PropositionDocument, { active: true }),
                utils.include(PropositionGoal, { active: true }),
                utils.include(Propositionkeyword, { active: true }),
                utils.include(PropositionRelated, { active: true }),
                utils.include(PropositionTypeProposition, { active: true }, false, null,
                    utils.include(PropositionType, { active: true }, false, null, null)),
                utils.include(PhysicalPerson, { active: true }, false, null,
                    utils.include(Person, { active: true }, false, null, null)),
                utils.include(Revenue, { active: true }, false, null, [
                    utils.include(RevenueOrigin, { active: true }, false, null, null),
                    utils.include(Unit, { active: true }, false, null,
                        utils.include(Address, { active: true }, false, null, null)),
                ]),
                utils.include(User, { active: true }, false, null,
                    utils.include(PhysicalPerson, { active: true }, false, null,
                        utils.include(Person, { active: true }), 'pf'
                    )
                )
            ];
            let start = req.query.start ? req.query.start.replace(/T[0-9][0-9]/i, "T00") : null;
            let end = req.query.end ? req.query.end.replace(/T[0-9][0-9]/i, "T23") : null;
            let dateWhere = null;
            let order = ['created_at', 'DESC']
            if (start && end) {
                dateWhere = {
                    [Op.between]: [start, end]
                };
            } else if (start && !end) {
                let stt = new Date(start)
                let dataFormatada = (stt.getFullYear() + "-" + (adicionaZero(stt.getMonth() + 1).toString()) + "-" + (adicionaZero(stt.getDate() + 1)));
                let dateFinal = new Date(dataFormatada + 'T23:59:00Z');
                dateWhere = {
                    [Op.between]: [start, dateFinal]
                };
            } else if (!start && end) {
                dateWhere = {
                    [Op.lte]: end
                }
            }

            let where = {
                active: true
            }

            if (dateWhere) {
                where[Op.or] = [{
                    created_at: dateWhere
                }]
            }

            let projectLeiWhere = req.query.projectLei; 
            if (projectLeiWhere) {
                include.push(utils.include(PropositionTypeProposition, { active: true, proposition_type: 7 }, true, null))
            }
            let announcementsWhere = req.query.announcements;
            if (announcementsWhere) {
                include.push(utils.include(PropositionTypeProposition, { active: true, proposition_type: 1 }, true, null))
            }
            let contractWhere = req.query.contract;
            if (contractWhere) {
                include.push(utils.include(PropositionTypeProposition, { active: true, proposition_type: 2 }, true, null))
            }
            let amendmentWhere = req.query.amendment;
            if (amendmentWhere) {
                include.push(utils.include(PropositionTypeProposition, { active: true, proposition_type: 4 || 11 || 12 || 13 || 14 }, true, null))
            }
            let biddingWhere = req.query.bidding;
            if (biddingWhere) {
                include.push(utils.include(PropositionTypeProposition, { active: true, proposition_type: 5 }, true, null))
            }
            let craftWhere = req.query.craft;
            if (craftWhere) {
                include.push(utils.include(PropositionTypeProposition, { active: true, proposition_type: 6 }, true, null))
            }
            let orderWhere = req.query.order;
            if (orderWhere) {
                include.push(utils.include(PropositionTypeProposition, { active: true, proposition_type: 8 }, true, null))
            }
            let resourceWhere = req.query.resource;
            if (resourceWhere) {
                include.push(utils.include(PropositionTypeProposition, { active: true, proposition_type: 9 }, true, null))
            }
            let requirementsWhere = req.query.requirements;
            if (requirementsWhere) {
                include.push(utils.include(PropositionTypeProposition, { active: true, proposition_type: 10 }, true, null))
            }
            let worksWhere = req.query.works;
            if (worksWhere) {
                include.push(utils.include(PropositionTypeProposition, { active: true, proposition_type: 17 }, true, null))
            }
            let favoriteWhere = req.query.favorite;
            if (favoriteWhere) {
                where = {
                    ...where,
                    favorite: 1
                }
            }
            let titleWhere = req.query.keytTitle;
            if (titleWhere) {
                where = {
                    ...where,
                    title: { [Op.regexp]: titleWhere }  
                }
            }
            if (!projectLeiWhere && !announcementsWhere && !contractWhere && !amendmentWhere && !biddingWhere && !craftWhere && !orderWhere && !resourceWhere && !requirementsWhere && !worksWhere) {
                include.push(utils.include(PropositionTypeProposition, { active: true }, false, null,
                    utils.include(PropositionType, { active: true }, false, null, null)))
            }
            let keywordWhere = req.query.keyword;
            if (keywordWhere) {
                include.push(utils.include(Propositionkeyword, { active: true, word: { [Op.regexp]: keywordWhere } }, true, null))
            } else {
                include.push(utils.include(Propositionkeyword, { active: true }, false, null))
            }

            let unitTaskWhere = req.query.unit;
            if (unitTaskWhere) {
                include.push(utils.include(PropositionTask, { active: true }, true, null,
                    utils.include(Task, { active: true, unit: unitTaskWhere }, true, null, [
                        utils.include(TaskResponsible, { active: true }, false, null,
                            utils.include(PhysicalPerson, { active: true }, false, null,
                                utils.include(Person, { active: true }, false, null, null))),
                        utils.include(Theme, { active: true }, false, null)

                    ])
                ))
            }
            else {
                include.push(utils.include(PropositionTask, { active: true }, true, null,
                    utils.include(Task, { active: true }, true, null, [
                        utils.include(TaskResponsible, { active: true }, false, null,
                            utils.include(PhysicalPerson, { active: true }, false, null,
                                utils.include(Person, { active: true }, false, null, null))),
                        utils.include(Theme, { active: true }, false, null)

                    ])
                ))
            }

            let createdByWhere = req.query.createdBy;
            if (createdByWhere) {
                include.push(utils.include(User, { active: true, id: createdByWhere }, true, null,
                    utils.include(PhysicalPerson, { active: true }, true, null,
                        utils.include(Person, { active: true }), 'pf'
                    )
                ))
            } else {
                include.push(utils.include(User, { active: true }, false, null,
                    utils.include(PhysicalPerson, { active: true }, false, null,
                        utils.include(Person, { active: true }), 'pf'
                    )
                ))
            }
            let eventsChecklistWhere = req.query.events;
            if (eventsChecklistWhere) {
                include.push(utils.include(PropositionTask, { active: true }, true, null,
                    utils.include(Task, { active: true, event: true, theme: 12 }, true, null,
                        utils.include(TaskResponsible, { active: true }, true, null,
                            utils.include(PhysicalPerson, { active: true }, true, null,
                                utils.include(Person, { active: true }, true, null, null))))))
            } else {
                include.push(utils.include(PropositionTask, { active: true }, false, null,
                    utils.include(Task, { active: true }, false, null,
                        utils.include(TaskResponsible, { active: true }, false, null,
                            utils.include(PhysicalPerson, { active: true }, false, null,
                                utils.include(Person, { active: true }, false, null, null))))))

            }
            let levelChecklistWhere = req.query.level;
            if (levelChecklistWhere) {
                order = ['level', 'DESC']
            }
            let pendingChecklistWhere = req.query.pending;
            if (pendingChecklistWhere) {
                where = {
                    ...where,
                    status: 1
                }
            }
            let doingChecklistWhere = req.query.doing;
            if (doingChecklistWhere) {
                where = {
                    ...where,
                    status: 2
                }
            }
            let finishedChecklistWhere = req.query.finished;
            if (finishedChecklistWhere) {
                where = {
                    ...where,
                    status: 3
                }
            }

            const proposition = await Proposition.findAll({
                order: [order],
                where: where,
                include
            });
            return res.json(
                content(proposition)
            )
        } catch (e) {
            console.error(e)
        }
    }

    async getById(req, res) {
        const proposition = await Proposition.findOne({
            where: {
                id: req.params.id,
                active: true
            },
            include
        })

        return res.status(200).json({
            proposition,
        })
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body;
            let expense_stored;
            if (data.Expense && data.Expense.value) {
                data.Expense.value = data.Expense.value.toString()
                if (data.Expense.value.includes('.')) {
                    data.Expense.value = data.Expense.value.replace('.', '')
                }
                if (data.Expense.value.includes('.')) {
                    data.Expense.value = data.Expense.value.replace('.', '')
                }
                if (data.Expense.value.includes('.')) {
                    data.Expense.value = data.Expense.value.replace('.', '')
                }
                if (data.Expense.value.includes(',')) {
                    data.Expense.value = data.Expense.value.replace(',', '.')
                }
                expense_stored = await Expense.create(data.Expense, { transaction });

                await Promise.all(data.origin.map(async (value) => {
                    let revenueOrigin = {
                        expense: expense_stored.id,
                        origin: value.id
                    }
                    await RevenueOrigin.create(revenueOrigin, { transaction });
                }));

                data.expense = expense_stored.id;
            }

            let proposition_stored = await Proposition.create(data, {
                transaction
            });

            if (data.PropositionRevenueList && data.PropositionRevenueList.length > 0) {
                await Promise.all(data.PropositionRevenueList.map(async (value) => {
                    let propositionRevenueObj = {
                        revenue: value.revenue ? value.revenue : value.id,
                        proposition: value.proposition ? value.proposition : proposition_stored.id
                    }
                    await PropositionRevenue.create(propositionRevenueObj, {
                        transaction
                    });
                }));
            }

            if (data.PropositionTheme) {
                await Promise.all(data.PropositionTheme.map(async (value) => {
                    let objPropositionTheme = {
                        proposition: proposition_stored.id,
                        theme: value.id
                    }
                    await PropositionTheme.create(objPropositionTheme, { transaction });
                }));
            }

            if (data.PropositionTask) {
                await Promise.all(data.PropositionTask.map(async (value) => {
                    let task_stored = await Task.create(value, { transaction });

                    let objPropositionTask = {
                        proposition: proposition_stored.id,
                        task: task_stored.id
                    }
                    await PropositionTask.create(objPropositionTask, { transaction });

                    await Promise.all(value.responsibles.map(async (value) => {
                        let objTaskResponsible = {
                            task: task_stored.id,
                            responsible: value.id
                        }
                        await TaskResponsible.create(objTaskResponsible, { transaction });

                    }));
                }));
            }

            if (data.PropositionDemand) {
                await Promise.all(data.PropositionDemand.map(async (value) => {
                    let obj = {
                        proposition: proposition_stored.id,
                        demand: value.id
                    }
                    await PropositionDemand.create(obj, {
                        transaction
                    });
                }));
            }

            if (data.Document) {
                let objDocument = {
                    proposition: proposition_stored.id,
                    url: data.Document
                }
                await PropositionDocument.create(objDocument, {
                    transaction
                });
            }

            if (data.PropositionGoal) {
                await Promise.all(data.PropositionGoal.map(async (value) => {
                    value.proposition = proposition_stored.id;
                    await PropositionGoal.create(value, {
                        transaction
                    });
                }));
            }

            if (data.Propositionkeyword) {
                await Promise.all(data.Propositionkeyword.map(async (value) => {
                    value.proposition = proposition_stored.id;
                    value.word = value.label;
                    await Propositionkeyword.create(value, {
                        transaction
                    });
                }));
            }

            if (data.PropositionRelated) {
                await Promise.all(data.PropositionRelated.map(async (value) => {
                    let obj = {
                        proposition: proposition_stored.id,
                        related: value.id,
                    }
                    await PropositionRelated.create(obj, {
                        transaction
                    });
                }));
            }

            let PropositionTypePropositionObj = {
                proposition: proposition_stored.id,
                proposition_type: data.proposition_type
            }
            if (data.proposition_type) {
                let proposition_type_proposition_stored = await PropositionTypeProposition.create(PropositionTypePropositionObj, {
                    transaction
                });
            }

            await transaction.commit();

            return res.json(proposition_stored);
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            return res.status(400).json({
                error: 'Erro saving record'
            })
        }
    }

    async changeCommitted(req, res) {
        let transaction = await sequelize.transaction();
        let data = req.body

        const proposition = await Proposition.findByPk(req.params.id);

        if (!proposition) {
            return res.status(404).json({
                error: 'Proposition not found!'
            });
        }
        try {
            await Proposition.update(data, {
                where: {
                    id: req.params.id
                },
                transaction
            })

            await transaction.commit();
            return res.json({
                proposition
            })
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            return res.status(400).json({
                error: 'Error when updating demand'
            })
        }

    }

    async addFavorite(req, res) {
        try {

            let transaction = await sequelize.transaction();
            let data = req.body

            const proposition = await Proposition.findByPk(req.params.id);

            if (!proposition) {
                return res.status(404).json({
                    error: 'Proposistion not found!'
                });
            }
            await Proposition.update(data, {
                where: {
                    id: req.params.id
                },
                transaction
            })

            await transaction.commit();
            return res.json({
                proposition
            })
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            return res.status(400).json({
                error: 'Error when updating proposition'
            })
        }

    }

    async update(req, res) {
        try {

            let transaction = await sequelize.transaction();

            const proposition = await Proposition.findOne({
                where: {
                    id: req.params.id,
                    active: true
                },
                include
            });

            if (!proposition) {
                return res.status(404).json({ error: 'Proposition not found!' });
            }

            let data = req.body;

            if (proposition.Propositionkeywords) {
                await Promise.all(proposition.Propositionkeywords.map(async (value) => {
                    await Propositionkeyword.destroy({
                        where: { id: value.id }, transaction
                    })
                }));
                proposition.Propositionkeywords = [];
            }
            if (proposition.PropositionRevenues) {
                await Promise.all(proposition.PropositionRevenues.map(async (value) => {
                    await PropositionRevenue.destroy({
                        where: { id: value.id }, transaction
                    })
                }));
                proposition.PropositionRevenues = [];
            }

            if (proposition.PropositionThemes) {
                await Promise.all(proposition.PropositionThemes.map(async (value) => {
                    await PropositionTheme.destroy({
                        where: { id: value.id }
                    })
                }));
                proposition.PropositionThemes = [];
            }
            if (proposition.PropositionDocument) {
                await PropositionDocument.destroy({
                    where: { id: proposition.PropositionDocument.id }
                })
                proposition.PropositionDocuments = [];
            }

            if (proposition.PropositionDemands) {
                await Promise.all(proposition.PropositionDemands.map(async (value) => {
                    await PropositionDemand.destroy({
                        where: { id: value.id }, transaction
                    })
                }));
                proposition.PropositionDemands = [];
            }

            if (proposition.PropositionRelateds) {
                await Promise.all(proposition.PropositionRelateds.map(async (value) => {
                    await PropositionRelated.destroy({
                        where: { id: value.id }, transaction
                    })
                }));
                proposition.PropositionRelateds = [];
            }

            if (proposition.Revenue && proposition.Revenue.RevenueOrigins) {
                await Promise.all(proposition.Revenue.RevenueOrigins.map(async (value) => {
                    await RevenueOrigin.destroy({
                        where: { id: value.id }, transaction
                    })
                }));
                proposition.Revenue.RevenueOrigins = [];
            }

            if (data.Expense && data.Expense.value) {
                // data.Expense.value = parseFloat(data.Expense.value)
                data.Expense.value = data.Expense.value.toString()
                if (data.Expense.value.includes('.')) {
                    data.Expense.value = data.Expense.value.replace('.', '')
                }
                if (data.Expense.value.includes('.')) {
                    data.Expense.value = data.Expense.value.replace('.', '')
                }
                if (data.Expense.value.includes('.')) {
                    data.Expense.value = data.Expense.value.replace('.', '')
                }
                if (data.Expense.value.includes(',')) {
                    data.Expense.value = data.Expense.value.replace(',', '.')
                }

                let newExpense = await Expense.create(data.Expense, {
                    transaction
                });

                await Promise.all(data.origin.map(async (value) => {
                    let revenueOrigin = {
                        expense: newExpense.id,
                        origin: value.origin ? value.origin : value.id
                    }
                    await RevenueOrigin.create(revenueOrigin, {
                        transaction
                    });
                }));

                data.revenue = 60;
                data.expense = newExpense.id;
            }

            const proposition_stored = await proposition.update(data, {
                where: {
                    id: proposition.id
                },
                transaction
            });

            await Promise.all(data.PropositionRevenueList.map(async (value) => {
                let propositionRevenueObj = {
                    revenue: value.revenue ? value.revenue : value.id,
                    proposition: value.proposition ? value.proposition : proposition_stored.id
                }
                await PropositionRevenue.create(propositionRevenueObj, {
                    transaction
                });
            }));

            //Tema da proposição
            if (data.PropositionTheme) {
                await Promise.all(data.PropositionTheme.map(async (value) => {
                    if (!value.id && !value.theme) {
                        let obj = {
                            description: value.label,
                        }
                        let theme_stored = await Theme.create(obj, {
                            transaction
                        });
                        await PropositionTheme.create({
                            proposition: proposition.id,
                            theme: theme_stored.id,
                        }, { transaction })
                    }
                    else {
                        await PropositionTheme.create({
                            proposition: proposition.id,
                            theme: value.theme ? value.theme : value.id,
                        }, { transaction })
                    }
                }));
            }
            //Tarefa da proposição
            if (data.PropositionTask) {
                await Promise.all(data.PropositionTask.map(async (value) => {
                    if (!value.id) {
                        let task_stored = await Task.create(value, { transaction });

                        let objPropositionTask = {
                            proposition: proposition_stored.id,
                            task: task_stored.id
                        }
                        await PropositionTask.create(objPropositionTask, { transaction });

                        await Promise.all(value.responsibles.map(async (value) => {
                            let objTaskResponsible = {
                                task: task_stored.id,
                                responsible: value.id
                            }
                            await TaskResponsible.create(objTaskResponsible, { transaction });

                        }));
                    }
                }));
            }
            //Demanda Relacionada a proposição
            if (data.PropositionDemand) {
                await Promise.all(data.PropositionDemand.map(async (value) => {
                    await PropositionDemand.create({
                        proposition: proposition.id,
                        demand: value.id,
                    }, { transaction })
                }));
            }
            //Documents relacionados a proposição
            if (data.Document) {
                await PropositionDocument.create({
                    proposition: proposition.id,
                    url: data.Document,
                }, { transaction })
            }
            //Metas relacionadas a proposição
            if (data.PropositionGoal) {
                await Promise.all(data.PropositionGoal.map(async (value) => {
                    await PropositionGoal.create({
                        proposition: proposition.id,
                        goal: value.goal,
                    }, { transaction })
                }));
            }
            //Palavras-chaves relacionadas a proposição
            if (data.Propositionkeyword) {
                await Promise.all(data.Propositionkeyword.map(async (value) => {
                    value.proposition = proposition.id;
                    value.word = value.label;
                    await Propositionkeyword.create(value, {
                        transaction
                    });
                }));
            }
            //Proposição relacionadas a proposição
            if (data.PropositionRelated) {
                await Promise.all(data.PropositionRelated.map(async (value) => {
                    let obj = {
                        proposition: proposition_stored.id,
                        related: value.id,
                    }

                    await PropositionRelated.create(obj, { transaction })
                }));
            }
            //tipo de proposição relacionadas a proposição
            if (data.PropositionTypeProposition && data.PropositionTypeProposition.length > 0) {
                await Promise.all(data.PropositionTypeProposition.map(async (value) => {
                    await PropositionTypeProposition.create({
                        proposition: proposition.id,
                        proposition_type: value.proposition_type,
                    }, { transaction })
                }));
            }

            await transaction.commit();
            console.log(transaction)
            return res.json(proposition);
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            return res.status(400).json({
                error: 'Error updating record'
            })
        }

    }

    async delete(req, res) {
        const proposition = await Proposition.findByPk(req.params.id);

        if (!proposition)
            return res.status(400).json({
                error: 'This Proposition does not exists!'
            });

        await proposition.update({
            active: false
        });

        return res.status(200).json({
            message: 'Proposition successfully deleted!'
        });
    }

    async getByUnit(req, res) {
        const propositions = await Proposition.findAll({
            where: {
                unit: req.params.id,
                active: true
            },
            include
        });

        return res.status(200).json(content(propositions));
    }
}


export default new PropositionController();
