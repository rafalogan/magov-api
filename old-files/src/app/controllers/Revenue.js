import database from '../../database/index.js';
import utils from './utils.js';
import Revenue from '../models/Revenue.js';
import RevenueOrigin from '../models/RevenueOrigin.js';
import RevenueReceiptForm from '../models/RevenueReceiptForm.js';
import RevenueTypeRevenue from '../models/RevenueTypeRevenue.js';
import content from './content.js';
import EngageDocument from '../models/EngageDocument.js';
import RevenueType from '../models/RevenueType.js';
import Unit from '../models/Unit.js';
import Address from '../models/Address.js';
import Proposition from '../models/Proposition.js';
import PropositionRevenue from '../models/PropositionRevenue.js';
import Expense from '../models/Expense.js';

const sequelize = database.connection;

let include = [
    utils.include(Proposition, { active: true }, false, null,
        utils.include(Expense, { active: true }, false, null, null)),
    utils.include(PropositionRevenue, { active: true }, false, null, [
        utils.include(Proposition, { active: true }, false, null,
            [
                utils.include(PropositionRevenue, { active: true }, false, null, [
                    utils.include(Revenue, { active: true }, false, null, null),
                ]),
                utils.include(Expense, { active: true }, false, null, null),
            ]
        ),
        utils.include(Revenue, { active: true }, false, null, null),
    ]),
    utils.include(RevenueOrigin, {
        active: true
    }),
    utils.include(Unit, { active: true }, false, null,
        utils.include(Address, { active: true }, false, null, null)),
    utils.include(RevenueReceiptForm, {
        active: true
    }),
    utils.include(RevenueTypeRevenue, { active: true }, false, null,
        utils.include(RevenueType, { active: true }, false, null, null)),
    utils.include(EngageDocument, {
        active: true
    }),
];
class RevenueController {

    async filter(req, res) {
        let include = [
            utils.include(EngageDocument, {
                active: true
            }, true)
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

        if (dateWhere) {
            where[Op.or] = [{
                created_at: dateWhere
            }]
        }

        const revenue = await Revenue.findAll({
            order: ['id'],
            where: where,
            include
        });

        return res.json(content(revenue));
    }

    async index(req, res) {
        let include = [
            utils.include(Proposition, { active: true }, false, null,
                utils.include(Expense, { active: true }, false, null, null)),
                utils.include(PropositionRevenue, { active: true }, false, null, [
                    utils.include(Proposition, { active: true }, false, null,
                        [
                            utils.include(PropositionRevenue, { active: true }, false, null, [
                                utils.include(Revenue, { active: true }, false, null, null),
                            ]),
                            utils.include(Expense, { active: true }, false, null, null),
                        ]
                    ),
                    utils.include(Revenue, { active: true }, false, null, null),
                ]),
            utils.include(RevenueOrigin, {
                active: true
            }),
            utils.include(Unit, { active: true }, false, null,
                utils.include(Address, { active: true }, false, null, null)),
            utils.include(RevenueReceiptForm, {
                active: true
            }),
            utils.include(RevenueTypeRevenue, { active: true }, false, null,
                utils.include(RevenueType, { active: true }, false, null, null)),
            utils.include(EngageDocument, {
                active: true
            }),
        ];
        const revenue = await Revenue.findAll({
            order: ['id'],
            where: {
                active: true
            },
            include
        });
        return res.json(
            content(revenue)
        );
    }

    async getById(req, res) {
        let include = [
            utils.include(RevenueOrigin, {
                active: true
            }),
            utils.include(Unit, { active: true }, false, null,
                utils.include(Address, { active: true }, false, null, null)),
            utils.include(RevenueReceiptForm, {
                active: true
            }),
            utils.include(RevenueTypeRevenue, { active: true }, false, null,
                utils.include(RevenueType, { active: true }, false, null, null)),
            utils.include(EngageDocument, {
                active: true
            }),
        ];
        const revenue = await Revenue.findOne({
            where: {
                id: req.params.id,
                active: true
            },
            include
        });

        return res.status(200).json({
            revenue,
        });
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body;

            if (data.value) {
                data.value = data.value.toString()
                if (data.value.includes('.')) {
                    data.value = data.value.replace('.', '')
                }
                if (data.value.includes('.')) {
                    data.value = data.value.replace('.', '')
                }
                if (data.value.includes('.')) {
                    data.value = data.value.replace('.', '')
                }
                if (data.value.includes(',')) {
                    data.value = data.value.replace(',', '.')
                }
            }

            let revenue_stored = await Revenue.create(data, {
                transaction
            });

            if (data.propositions) {
                await Promise.all(data.propositions.map(async (value) => {
                    let propositionRevenue = {
                        revenue: revenue_stored.id,
                        proposition: value.id
                    }
                    await PropositionRevenue.create(propositionRevenue, { transaction });
                    let objProposition = {
                        ...value,
                        committed: true
                    }
                    await Proposition.update(objProposition, {
                        where: {
                            id: value.id
                        },
                        transaction
                    });
                }));
            }

            if (data.RevenueOrigin) {
                await Promise.all(data.RevenueOrigin.map(async (value) => {
                    value.revenue = revenue_stored.id;
                    value.active = true;
                    await RevenueOrigin.create(value, {
                        transaction
                    });
                }));
            }

            if (data.RevenueReceiptForm) {
                await Promise.all(data.RevenueReceiptForm.map(async (value) => {
                    value.revenue = revenue_stored.id;
                    value.active = true;
                    await RevenueReceiptForm.create(value, {
                        transaction
                    });
                }));
            }
            if (data.revenueType) {
                let obj = {
                    revenue: revenue_stored.id,
                    type: data.revenueType.id,
                    active: true,

                }
                await RevenueTypeRevenue.create(obj, {
                    transaction
                });
            }

            // if (revenue_stored.document != null) {
            //     let budget = await budgetAmendments();

            //     await Promise.all(budget.data.map(async (value) => {
            //         let obj = {
            //             revenue: revenue_stored.id,
            //             data: value.data,
            //             flg_existe_documento_relacionado_no_d_m: value.flgExisteDocumentoRelacionadoNoDM,
            //             fase: value.fase,
            //             documento: value.documento,
            //             documento_resumido: value.documentoResumido,
            //             especie: value.especie,
            //             orgao_superior: value.orgaoSuperior,
            //             orgao_vinculado: value.orgaoVinculado,
            //             unidade_gestora: value.unidadeGestora,
            //             elemento_despesa: value.elementoDespesa,
            //             favorecido: value.favorecido,
            //             valor: value.valor,
            //         }
            //         await EngageDocument.create(obj, {
            //             transaction
            //         })
            //     }))
            // }

            await transaction.commit();
            return res.json(revenue_stored);

        } catch (error) {
            await transaction.rollback();
            console.log(error);
            return res.status(400).json({
                error: 'Erro saving record'
            })
        }
    }


    async update(req, res) {

        const revenue = await Revenue.findOne({
            where: {
                id: req.params.id,
                active: true
            },
            include
        });

        if (!revenue) {
            return res.status(404).json({
                error: 'Revenue not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            if (revenue.PropositionRevenues) {
                await Promise.all(revenue.PropositionRevenues.map(async (value) => {
                    await PropositionRevenue.destroy({
                        where: { id: value.id }, transaction
                    })
                }));
                revenue.PropositionRevenues = [];
            }

            if (data.value) {
                data.value = data.value.toString()
                if (data.value.includes('R')) {
                    data.value = data.value.replace('R', '')
                }
                if (data.value.includes('$')) {
                    data.value = data.value.replace('$', '')
                }
                data.value = data.value.trim()
                if (data.value.includes('.')) {
                    data.value = data.value.replace('.', '')
                }
                if (data.value.includes('.')) {
                    data.value = data.value.replace('.', '')
                }
                if (data.value.includes('.')) {
                    data.value = data.value.replace('.', '')
                }
                if (data.value.includes(',')) {
                    data.value = data.value.replace(',', '.')
                }
            }

            let revenue_updated = await revenue.update(data, {
                transaction
            });

            if (data.propositions) {
                await Promise.all(data.propositions.map(async (value) => {
                    let propositionRevenue = {
                        revenue: revenue_updated.id,
                        proposition: value.proposition ? value.proposition : value.id
                    }
                    await PropositionRevenue.create(propositionRevenue, { transaction });
                    let objProposition = {
                        ...value,
                        committed: true
                    }
                    await Proposition.update(objProposition, {
                        where: {
                            id: value.id
                        },
                        transaction
                    });
                }));
            }

            if (data.RevenueOrigin) {
                await Promise.all(data.RevenueOrigin.map(async (value) => {
                    if (value.id) {
                        await RevenueOrigin.update(value, {
                            where: {
                                id: value.id,
                            },
                            transaction
                        });
                    } else {
                        await RevenueOrigin.create({
                            revenue: revenue.id,
                            origin: value.value,
                        }, {
                            transaction
                        });
                    }
                }));
            }

            if (data.RevenueOriginRemove) {
                await Promise.all(data.RevenueOriginRemove.map(async (value) => {
                    await RevenueOrigin.update({
                        active: false,
                    }, {
                        where: {
                            id: value.id
                        },
                        transaction
                    })
                }));
            }

            if (data.RevenueReceiptForm) {
                await Promise.all(data.RevenueReceiptForm.map(async (value) => {
                    if (value.id) {
                        await RevenueReceiptForm.update(value, {
                            where: {
                                id: value.id,
                            },
                            transaction
                        });
                    } else {
                        await RevenueReceiptForm.create({
                            revenue: revenue.id,
                            receipt_form: value.receipt_form,
                        }, {
                            transaction
                        });
                    }
                }));
            }

            if (data.RevenueReceiptFormRemove) {
                await Promise.all(data.RevenueReceiptFormRemove.map(async (value) => {
                    await RevenueReceiptForm.update({
                        active: false,
                    }, {
                        where: {
                            id: value.id
                        },
                        transaction
                    })
                }));
            }

            if (data.revenueType.id) {
                if (revenue_updated.RevenueTypeRevenue) {
                    let obj = {
                        revenue: revenue_updated.id,
                        type: data.revenueType.id,
                        active: true,
                    }
                    await RevenueTypeRevenue.update(obj, {
                        where: {
                            id: revenue_updated.RevenueTypeRevenue.id
                        },
                        transaction
                    });
                }
                else {
                    let obj = {
                        revenue: revenue_updated.id,
                        type: data.revenueType.id,
                        active: true,
                    }
                    await RevenueTypeRevenue.create(obj, {
                        transaction
                    });
                }
            }

            // if (revenue.document != null && revenue.document != data.document) {
            //     await EngageDocument.update({
            //         active: false,
            //     }, {
            //         where: {
            //             revenue: revenue.id
            //         }
            //     })
            //     let budget = await budgetAmendments();

            //     await Promise.all(budget.data.map(async (value) => {
            //         let obj = {
            //             revenue: revenue.id,
            //             data: value.data,
            //             flg_existe_documento_relacionado_no_d_m: value.flgExisteDocumentoRelacionadoNoDM,
            //             fase: value.fase,
            //             documento: value.documento,
            //             documento_resumido: value.documentoResumido,
            //             especie: value.especie,
            //             orgao_superior: value.orgaoSuperior,
            //             orgao_vinculado: value.orgaoVinculado,
            //             unidade_gestora: value.unidadeGestora,
            //             elemento_despesa: value.elementoDespesa,
            //             favorecido: value.favorecido,
            //             valor: value.valor,
            //         }
            //         await EngageDocument.create(obj, {
            //             transaction
            //         })
            //     }))
            // }


            await transaction.commit();
            return res.json(revenue);
        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Error updating record'
            })
        }

    }

    async delete(req, res) {

        const revenue = await Revenue.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!revenue)
            return res.status(400).json({
                error: 'This Revenue does not exists!'
            });

        await revenue.update({
            active: false
        });

        return res.status(200).json({
            message: 'Revenue successfully deleted!'
        });
    }
}

export default new RevenueController();
