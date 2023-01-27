import Demand from '../models/Demand.js';
import content from './content.js';
import utils from './utils.js';
import database from '../../database/index.js';
import DemandDocument from '../models/DemandDocument.js';
import DemandGoal from '../models/DemandGoal.js';
import DemandKeyword from '../models/DemandKeyword.js';
import DemandTask from '../models/DemandTask.js';
import DemandTypeDemand from '../models/DemandTypeDemand.js';
import Goal from '../models/Goal.js';
import Task from '../models/Task.js';
import DemandType from '../models/DemandType.js';
import Plaintiff from '../models/Plaintiff.js';
import Person from '../models/Person.js';
import PhysicalPerson from '../models/PhysicalPerson.js';
import Company from '../models/Company.js';
import Address from '../models/Address.js';
import InstituteType from '../models/InstituteType.js';
import Contact from '../models/Contact.js';

const sequelize = database.connection;
import { Op, Sequelize } from 'sequelize';
import User from '../models/User.js';
import TaskResponsible from '../models/TaskResponsible.js';
import Theme from '../models/Theme.js';
import Unit from '../models/Unit.js';

function adicionaZero(numero) {
    if (numero <= 9) return '0' + numero;
    else return numero;
}
let include = [
    utils.include(DemandDocument, {
        active: true
    }),
    utils.include(PhysicalPerson, { active: true }, false, null, [
        utils.include(Person, { active: true }, false, null, [
            utils.include(Address, { active: true }),
            utils.include(Contact, { active: true })
        ])
    ]),
    utils.include(Plaintiff, { active: true }, false, null, [
        utils.include(Person, { active: true }, false, null, [
            utils.include(Address, { active: true }),
            utils.include(Contact, { active: true })
        ]),
        utils.include(InstituteType, { active: true })
    ]),
    utils.include(
        DemandGoal,
        {
            active: true
        },
        false,
        null,
        utils.include(Goal),
        {
            active: true
        }
    ),
    utils.include(
        DemandKeyword,
        {
            active: true
        },
        true
    ),
    utils.include(
        DemandTask,
        {
            active: true
        },
        false,
        null,
        utils.include(Task),
        {
            active: true
        }
    ),
    utils.include(
        DemandTypeDemand,
        {
            active: true
        },
        false,
        null,
        utils.include(DemandType),
        {
            active: true
        }
    ),
    utils.include(
        User,
        { active: true },
        false,
        null,
        utils.include(
            PhysicalPerson,
            { active: true },
            false,
            null,
            utils.include(Person, { active: true }),
            'pf'
        )
    )
    // utils.include(Unit, { active: true },false, null)
];

const customOrder = (column, values) => {
    try {
        let orderByClause = 'CASE ';

        for (let index = 0; index < values.length; index++) {
            let value = values[index].id;

            if (typeof value === 'string') value = `'${value}'`;

            orderByClause += `WHEN ${column} = ${value} THEN '${value}' `;
        }

        orderByClause += `ELSE ${column} END`;

        return [Sequelize.literal(orderByClause)];
    } catch (e) {
        console.log(e);
    }
};
const orderByCount = arr => {
    return arr.sort((a, b) => {
        return a.count > b.count ? -1 : 1;
    });
};
class DemandController {
    async index(req, res) {
        try {
            include = [];
            include = [
                utils.include(DemandDocument, {
                    active: true
                }),
                utils.include(PhysicalPerson, { active: true }, false, null, [
                    utils.include(Person, { active: true }, false, null, [
                        utils.include(Address, { active: true }),
                        utils.include(Contact, { active: true })
                    ])
                ]),
                utils.include(Plaintiff, { active: true }, false, null, [
                    utils.include(Person, { active: true }, false, null, [
                        utils.include(Address, { active: true }),
                        utils.include(Contact, { active: true })
                    ]),
                    utils.include(InstituteType, { active: true })
                ]),
                utils.include(
                    DemandGoal,
                    {
                        active: true
                    },
                    false,
                    null,
                    utils.include(Goal),
                    {
                        active: true
                    }
                ),
                utils.include(
                    DemandKeyword,
                    {
                        active: true
                    },
                    true
                ),
                utils.include(
                    DemandTask,
                    {
                        active: true
                    },
                    false,
                    null,
                    utils.include(Task),
                    {
                        active: true
                    }
                ),
                utils.include(
                    DemandTypeDemand,
                    {
                        active: true
                    },
                    false,
                    null,
                    utils.include(DemandType),
                    {
                        active: true
                    }
                ),
                utils.include(
                    User,
                    { active: true },
                    false,
                    null,
                    utils.include(
                        PhysicalPerson,
                        { active: true },
                        false,
                        null,
                        utils.include(Person, { active: true }),
                        'pf'
                    )
                )
            ];
            let start = req.query.start
                ? req.query.start.replace(/T[0-9][0-9]/i, 'T00')
                : null;
            let end = req.query.end
                ? req.query.end.replace(/T[0-9][0-9]/i, 'T23')
                : null;
            let dateWhere = null;
            let order = ['created_at', 'DESC'];
            if (start && end) {
                dateWhere = {
                    [Op.between]: [start, end]
                };
            } else if (start && !end) {
                let stt = new Date(start);
                let dataFormatada =
                    stt.getFullYear() +
                    '-' +
                    adicionaZero(stt.getMonth() + 1).toString() +
                    '-' +
                    adicionaZero(stt.getDate() + 1);
                let dateFinal = new Date(dataFormatada + 'T23:59:00Z');
                dateWhere = {
                    // [Op.gte]: start
                    [Op.between]: [start, dateFinal]
                };
            } else if (!start && end) {
                dateWhere = {
                    [Op.lte]: end
                };
            }

            let where = {
                active: true
            };

            if (dateWhere) {
                where[Op.or] = [
                    {
                        created_at: dateWhere
                    }
                ];
            }

            let favoriteWhere = req.query.favorite;
            if (favoriteWhere) {
                where = {
                    ...where,
                    favorite: 1
                };
            }
            let titleWhere = req.query.keytitle;
            if (titleWhere) {
                where = {
                    ...where,
                    name: { [Op.regexp]: titleWhere }
                };
            }

            let alphabeticWhere = req.query.alphabetic;
            if (alphabeticWhere) {
                order = ['name', 'ASC'];
            }
            let levelWhere = req.query.level;
            if (levelWhere) {
                order = ['level', 'DESC'];
            }
            let deadlineWhere = req.query.deadline;
            if (deadlineWhere) {
                order = ['deadline', 'ASC'];
            }

            let keywordWhere = req.query.keyword;
            if (keywordWhere) {
                include.push(
                    utils.include(
                        DemandKeyword,
                        { active: true, word: { [Op.regexp]: keywordWhere } },
                        true,
                        null
                    )
                );
            } else {
                include.push(
                    utils.include(DemandKeyword, { active: true }, false, null)
                );
            }

            let createdByWhere = req.query.createdBy;
            if (createdByWhere) {
                include.push(
                    utils.include(
                        User,
                        { active: true, id: createdByWhere },
                        true,
                        null,
                        utils.include(
                            PhysicalPerson,
                            { active: true },
                            true,
                            null,
                            utils.include(Person, { active: true }),
                            'pf'
                        )
                    )
                );
            } else {
                include.push(
                    utils.include(
                        User,
                        { active: true },
                        false,
                        null,
                        utils.include(
                            PhysicalPerson,
                            { active: true },
                            false,
                            null,
                            utils.include(Person, { active: true }),
                            'pf'
                        )
                    )
                );
            }

            let unitTaskWhere = req.query.unit;
            if (unitTaskWhere) {
                include.push(
                    utils.include(
                        DemandTask,
                        {
                            active: true
                        },
                        true,
                        null,
                        utils.include(
                            Task,
                            {
                                active: true,
                                unit: unitTaskWhere
                            },
                            true,
                            null
                        ),
                        {
                            active: true
                        },
                        true,
                        null
                    )
                );
            } else {
                include.push(
                    utils.include(
                        DemandTask,
                        {
                            active: true
                        },
                        true,
                        null,
                        utils.include(
                            Task,
                            {
                                active: true
                            },
                            true,
                            null
                        ),
                        {
                            active: true
                        },
                        true,
                        null
                    )
                );
            }

            if (req.query.state && req.query.city) {
                include.push(
                    utils.include(
                        Plaintiff,
                        { active: true },
                        true,
                        null,
                        utils.include(
                            Person,
                            { active: true },
                            true,
                            null,
                            utils.include(
                                Address,
                                {
                                    active: true,
                                    uf: req.query.state,
                                    city: req.query.city
                                },
                                true,
                                null
                            )
                        )
                    )
                );
            } else if (req.query.state) {
                include.push(
                    utils.include(
                        Plaintiff,
                        { active: true },
                        true,
                        null,
                        utils.include(
                            Person,
                            { active: true },
                            true,
                            null,
                            utils.include(
                                Address,
                                { active: true, uf: req.query.state },
                                true,
                                null
                            )
                        )
                    )
                );
            }

            if (req.query.district) {
                include.push(
                    utils.include(
                        Plaintiff,
                        { active: true },
                        true,
                        null,
                        utils.include(
                            Person,
                            { active: true },
                            true,
                            null,
                            utils.include(
                                Address,
                                {
                                    active: true,
                                    district: {
                                        [Op.regexp]: req.query.district
                                    }
                                },
                                true,
                                null
                            )
                        )
                    )
                );
            }
            if (req.query.importance) {
                order = ['level', 'DESC'];
            }

            if (req.query.frequency) {
                const demandType = await DemandType.findAll({
                    order: ['id'],
                    where: where
                });

                const demandTypeDemand = await DemandTypeDemand.findAll({
                    order: ['id'],
                    where: where
                });

                let typeList = [];
                demandType.map(item => {
                    typeList.push({ id: item.id, count: 0 });
                });
                demandTypeDemand.map(item => {
                    typeList.map(tl => {
                        if (item.demand_type == tl.id) {
                            tl.count += 1;
                        }
                    });
                });
                typeList = orderByCount(typeList);
                order = customOrder('Demand.id', typeList);
            }

            let eventsChecklistWhere = req.query.events;
            if (eventsChecklistWhere) {
                include.push(
                    utils.include(
                        DemandTask,
                        { active: true },
                        true,
                        null,
                        utils.include(Task),
                        { active: true, event: true },
                        true,
                        null
                    )
                );
            } else {
                include.push(
                    utils.include(
                        DemandTask,
                        { active: true },
                        false,
                        null,
                        utils.include(Task),
                        { active: true },
                        false,
                        null
                    )
                );
            }
            let levelChecklistWhere = req.query.level;
            if (levelChecklistWhere) {
                order = ['level', 'DESC'];
            }
            let pendingChecklistWhere = req.query.pending;
            if (pendingChecklistWhere) {
                where = {
                    ...where,
                    status: 1
                };
            }
            let doingChecklistWhere = req.query.doing;
            if (doingChecklistWhere) {
                where = {
                    ...where,
                    status: 2
                };
            }
            let finishedChecklistWhere = req.query.finished;
            if (finishedChecklistWhere) {
                where = {
                    ...where,
                    status: 3
                };
            }

            // let listdemandKey = await DemandKeyword.findAll({
            //     order: [['created_at', 'DESC']],
            //     where: {
            //         active: true
            //     },
            // });

            // let demandKey=[]
            // listdemandKey.map((item) => {
            //     demandKey.push({ id: item.id, word: item.word, count: 0 })
            // })

            // demandKey.map(dk => {
            //     console.log(dk.word)
            //     const { count, rows } = DemandKeyword.findAndCountAll({
            //         where: {
            //             word: {
            //                 [Op.like]: 'saude'
            //             }
            //         },
            //         offset: 10,
            //         limit: 2
            //     });
            //     console.log(count);
            //     console.log(dk);
            //     dk.count = count;
            // })
            // console.log(demandKey)
            // demandKey = orderByCount(demandKey)

            const demand = await Demand.findAll({
                order: [order],
                where: where,
                include
            });
            return res.json(content(demand));
        } catch (e) {
            console.error(e);
        }
    }

    async getById(req, res) {
        const demand = await Demand.findOne({
            where: {
                id: req.params.id,
                active: true
            },
            include
        });

        return res.status(200).json({
            demand
        });
    }

    async getByUnit(req, res) {
        try {
            include = [];
            include = [
                utils.include(DemandDocument, {
                    active: true
                }),
                utils.include(PhysicalPerson, { active: true }, false, null, [
                    utils.include(Person, { active: true }, false, null, [
                        utils.include(Address, { active: true }),
                        utils.include(Contact, { active: true })
                    ])
                ]),
                utils.include(Plaintiff, { active: true }, false, null, [
                    utils.include(Person, { active: true }, false, null, [
                        utils.include(Address, { active: true }),
                        utils.include(Contact, { active: true })
                    ]),
                    utils.include(InstituteType, { active: true })
                ]),
                utils.include(
                    DemandGoal,
                    {
                        active: true
                    },
                    false,
                    null,
                    utils.include(Goal),
                    {
                        active: true
                    }
                ),
                utils.include(
                    DemandKeyword,
                    {
                        active: true
                    },
                    true
                ),
                utils.include(
                    DemandTask,
                    {
                        active: true
                    },
                    false,
                    null,
                    utils.include(Task),
                    {
                        active: true
                    }
                ),
                utils.include(
                    DemandTypeDemand,
                    {
                        active: true
                    },
                    false,
                    null,
                    utils.include(DemandType),
                    {
                        active: true
                    }
                ),
                utils.include(
                    User,
                    { active: true },
                    false,
                    null,
                    utils.include(
                        PhysicalPerson,
                        { active: true },
                        false,
                        null,
                        utils.include(Person, { active: true }),
                        'pf'
                    )
                )
            ];

            let start = req.query.start
                ? req.query.start.replace(/T[0-9][0-9]/i, 'T00')
                : null;
            let end = req.query.end
                ? req.query.end.replace(/T[0-9][0-9]/i, 'T23')
                : null;
            let dateWhere = null;
            let order = ['created_at', 'DESC'];
            if (start && end) {
                dateWhere = {
                    [Op.between]: [start, end]
                };
            } else if (start && !end) {
                let stt = new Date(start);
                let dataFormatada =
                    stt.getFullYear() +
                    '-' +
                    adicionaZero(stt.getMonth() + 1).toString() +
                    '-' +
                    adicionaZero(stt.getDate() + 1);
                let dateFinal = new Date(dataFormatada + 'T23:59:00Z');
                dateWhere = {
                    // [Op.gte]: start
                    [Op.between]: [start, dateFinal]
                };
            } else if (!start && end) {
                dateWhere = {
                    [Op.lte]: end
                };
            }

            let where = {
                active: true
            };

            if (dateWhere) {
                where[Op.or] = [
                    {
                        created_at: dateWhere
                    }
                ];
            }

            let favoriteWhere = req.query.favorite;
            if (favoriteWhere) {
                where = {
                    ...where,
                    favorite: 1
                };
            }
            let titleWhere = req.query.keytitle;
            if (titleWhere) {
                where = {
                    ...where,
                    name: { [Op.regexp]: titleWhere }
                };
            }

            let alphabeticWhere = req.query.alphabetic;
            if (alphabeticWhere) {
                order = ['name', 'ASC'];
            }
            let levelWhere = req.query.level;
            if (levelWhere) {
                order = ['level', 'DESC'];
            }
            let deadlineWhere = req.query.deadline;
            if (deadlineWhere) {
                order = ['deadline', 'ASC'];
            }

            let keywordWhere = req.query.keyword;
            if (keywordWhere) {
                include.push(
                    utils.include(
                        DemandKeyword,
                        { active: true, word: { [Op.regexp]: keywordWhere } },
                        true,
                        null
                    )
                );
            } else {
                include.push(
                    utils.include(DemandKeyword, { active: true }, false, null)
                );
            }

            let createdByWhere = req.query.createdBy;
            if (createdByWhere) {
                include.push(
                    utils.include(
                        User,
                        { active: true, id: createdByWhere },
                        true,
                        null,
                        utils.include(
                            PhysicalPerson,
                            { active: true },
                            true,
                            null,
                            utils.include(Person, { active: true }),
                            'pf'
                        )
                    )
                );
            } else {
                include.push(
                    utils.include(
                        User,
                        { active: true },
                        false,
                        null,
                        utils.include(
                            PhysicalPerson,
                            { active: true },
                            false,
                            null,
                            utils.include(Person, { active: true }),
                            'pf'
                        )
                    )
                );
            }

            let unitTaskWhere = req.query.unit;
            if (unitTaskWhere) {
                include.push(
                    utils.include(
                        DemandTask,
                        {
                            active: true
                        },
                        true,
                        null,
                        utils.include(
                            Task,
                            {
                                active: true,
                                unit: unitTaskWhere
                            },
                            true,
                            null
                        ),
                        {
                            active: true
                        },
                        true,
                        null
                    )
                );
            } else {
                include.push(
                    utils.include(
                        DemandTask,
                        {
                            active: true
                        },
                        true,
                        null,
                        utils.include(
                            Task,
                            {
                                active: true
                            },
                            true,
                            null
                        ),
                        {
                            active: true
                        },
                        true,
                        null
                    )
                );
            }

            if (req.query.state && req.query.city) {
                include.push(
                    utils.include(
                        Plaintiff,
                        { active: true },
                        true,
                        null,
                        utils.include(
                            Person,
                            { active: true },
                            true,
                            null,
                            utils.include(
                                Address,
                                {
                                    active: true,
                                    uf: req.query.state,
                                    city: req.query.city
                                },
                                true,
                                null
                            )
                        )
                    )
                );
            } else if (req.query.state) {
                include.push(
                    utils.include(
                        Plaintiff,
                        { active: true },
                        true,
                        null,
                        utils.include(
                            Person,
                            { active: true },
                            true,
                            null,
                            utils.include(
                                Address,
                                { active: true, uf: req.query.state },
                                true,
                                null
                            )
                        )
                    )
                );
            }

            if (req.query.district) {
                include.push(
                    utils.include(
                        Plaintiff,
                        { active: true },
                        true,
                        null,
                        utils.include(
                            Person,
                            { active: true },
                            true,
                            null,
                            utils.include(
                                Address,
                                {
                                    active: true,
                                    district: {
                                        [Op.regexp]: req.query.district
                                    }
                                },
                                true,
                                null
                            )
                        )
                    )
                );
            }
            if (req.query.importance) {
                order = ['level', 'DESC'];
            }

            if (req.query.frequency) {
                const demandType = await DemandType.findAll({
                    order: ['id'],
                    where: where
                });

                const demandTypeDemand = await DemandTypeDemand.findAll({
                    order: ['id'],
                    where: where
                });

                let typeList = [];
                demandType.map(item => {
                    typeList.push({ id: item.id, count: 0 });
                });
                demandTypeDemand.map(item => {
                    typeList.map(tl => {
                        if (item.demand_type == tl.id) {
                            tl.count += 1;
                        }
                    });
                });
                typeList = orderByCount(typeList);
                order = customOrder('Demand.id', typeList);
            }

            let eventsChecklistWhere = req.query.events;
            if (eventsChecklistWhere) {
                include.push(
                    utils.include(
                        DemandTask,
                        { active: true },
                        true,
                        null,
                        utils.include(Task),
                        { active: true, event: true },
                        true,
                        null
                    )
                );
            } else {
                include.push(
                    utils.include(
                        DemandTask,
                        { active: true },
                        false,
                        null,
                        utils.include(Task),
                        { active: true },
                        false,
                        null
                    )
                );
            }
            let levelChecklistWhere = req.query.level;
            if (levelChecklistWhere) {
                order = ['level', 'DESC'];
            }
            let pendingChecklistWhere = req.query.pending;
            if (pendingChecklistWhere) {
                where = {
                    ...where,
                    status: 1
                };
            }
            let doingChecklistWhere = req.query.doing;
            if (doingChecklistWhere) {
                where = {
                    ...where,
                    status: 2
                };
            }
            let finishedChecklistWhere = req.query.finished;
            if (finishedChecklistWhere) {
                where = {
                    ...where,
                    status: 3
                };
            }

            const demands = await Demand.findAll({
                order: [order],
                // where: where,
                where: { unit: req.params.id },
                include
            });

            return res.status(200).json(content(demands));
        } catch (e) {
            console.error(e);
        }
    }

    async getByDoc(req, res) {
        let wherePerson = { active: true };

        let include = [
            utils.include(
                Plaintiff,
                {
                    active: true
                },
                false,
                null,
                utils.include(
                    Person,
                    wherePerson,

                    false,
                    null,
                    [
                        utils.include(
                            PhysicalPerson,
                            {
                                active: true
                            },
                            false,
                            null,
                            utils.include(Company, {
                                active: true
                            })
                        ),
                        utils.include(Address, {
                            active: true
                        }),
                        utils.include(Contact, {
                            active: true
                        })
                    ]
                )
            )
        ];

        const physicalPerson = await PhysicalPerson.findOne({
            where: {
                cpf: req.body.doc,
                active: true
            }
        });

        const company = await Company.findOne({
            where: {
                cnpj: req.body.doc,
                active: true
            }
        });

        const demand = await Demand.findOne({
            where: {
                active: true
            },
            include
        });
        if (company) {
            wherePerson.person = company.person;

            return res.status(200).json(demand);
        } else if (physicalPerson) {
            wherePerson.person = physicalPerson.person;
            return res.status(200).json(demand);
        } else {
            return res.status(400).json({
                message: 'Documento não encontrado'
            });
        }
        return res.status(200).json({
            demand
        });
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body;

            if (!data.plaintiff.id) {
                data.address.cep = data.address.cep.toString().replace('.', '');
                data.address.cep = data.address.cep.toString().replace('-', '');
                data.physical_person.company = 1;

                let address_stored = await Address.create(data.address, {
                    transaction
                });
                let contact_stored;
                if (data.contact) {
                    // data.contact.phone = data.contact.phone.toString().replace('(', '');
                    // data.contact.phone = data.contact.phone.toString().replace(')', '');
                    // data.contact.phone = data.contact.phone.toString().replace('-', '');
                    contact_stored = await Contact.create(data.contact, {
                        transaction
                    });
                }

                let person_obj = {
                    name: data.person.name,
                    birth_date: data.person.birth_date,
                    address: address_stored.id,
                    contact: contact_stored.id
                };

                let person_stored = await Person.create(person_obj, {
                    transaction
                });

                let physical_person_obj = {
                    cpf: data.physical_person.cpf,
                    rg: data.physical_person.cpf,
                    person: person_stored.id,
                    company: 1
                };

                let physical_person_stored = await PhysicalPerson.create(
                    physical_person_obj,
                    {
                        transaction
                    }
                );

                let plaintiff_obj = {
                    person: person_stored.id,
                    institute_type: data.plaintiff.institute_type,
                    institute_person: data.plaintiff.institute_person,
                    relationship_type: data.plaintiff.relationship_type,
                    relatives: data.plaintiff.relatives,
                    note: data.plaintiff.note,
                    institute_representative:
                        data.plaintiff.institute_representative
                };

                let plaintiff_stored = await Plaintiff.create(plaintiff_obj, {
                    transaction
                });

                data.plaintiff = plaintiff_stored.id;
            } else {
                data.plaintiff = data.plaintiff.id;
            }

            let demand_stored = await Demand.create(data, {
                transaction
            });

            if (data.DemandDocument) {
                await Promise.all(
                    data.DemandDocument.map(async value => {
                        value.demand = demand_stored.id;
                        await DemandDocument.create(value, {
                            transaction
                        });
                    })
                );
            }
            if (data.DemandGoal) {
                await Promise.all(
                    data.DemandGoal.map(async value => {
                        value.demand = demand_stored.id;
                        await DemandGoal.create(value, {
                            transaction
                        });
                    })
                );
            }
            if (data.DemandKeyword) {
                await Promise.all(
                    data.DemandKeyword.map(async value => {
                        value.demand = demand_stored.id;
                        value.word = value.label;
                        await DemandKeyword.create(value, {
                            transaction
                        });
                    })
                );
            }
            if (data.DemandTask) {
                await Promise.all(
                    data.DemandTask.map(async value => {
                        value.demand = demand_stored.id;
                        await DemandTask.create(value, {
                            transaction
                        });
                    })
                );
            }
            if (data.DemandType) {
                await Promise.all(
                    data.DemandType.map(async value => {
                        if (value.label) {
                            let objType = {
                                demand: demand_stored.id,
                                demand_type: value.id
                            };
                            await DemandTypeDemand.create(objType, {
                                transaction
                            });
                        }
                    })
                );
            }

            await transaction.commit();

            return res.json(demand_stored);
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            return res.status(400).json({
                error: 'Error saving record'
            });
        }
    }
    async addFavorite(req, res) {
        let transaction = await sequelize.transaction();
        let data = req.body;

        const demand = await Demand.findByPk(req.params.id);

        if (!demand) {
            return res.status(404).json({
                error: 'Demand not found!'
            });
        }
        try {
            await Demand.update(data, {
                where: {
                    id: req.params.id
                },
                transaction
            });

            await transaction.commit();
            return res.json({
                demand
            });
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            return res.status(400).json({
                error: 'Error when updating demand'
            });
        }
    }

    async update(req, res) {
        try {
            let transaction = await sequelize.transaction();
            let data = req.body;

            const demand = await Demand.findOne({
                where: {
                    id: req.params.id,
                    active: true
                },
                include
            });

            if (!demand) {
                return res.status(404).json({
                    error: 'Demand not found!'
                });
            }

            if (demand.DemandKeywords.length > 0) {
                await Promise.all(
                    demand.DemandKeywords.map(async value => {
                        await DemandKeyword.destroy({
                            where: { id: value.id },
                            transaction
                        });
                    })
                );
                demand.DemandKeywords = [];
            }

            if (demand.DemandTypeDemands) {
                await Promise.all(
                    demand.DemandTypeDemands.map(async value => {
                        await DemandTypeDemand.destroy({
                            where: { id: value.id },
                            transaction
                        });
                    })
                );
                demand.DemandTypeDemands = [];
            }

            // if (!data.plaintiff.id) {
            data.physical_person.company = 1;
            data.address.cep = data.address.cep.toString().replace('.', '');
            data.address.cep = data.address.cep.toString().replace('-', '');

            let address_updated = await Address.update(data.address, {
                where: { id: demand.Plaintiff.Person.Address.id },
                transaction
            });
            let contact_updated;
            if (data.contact) {
                // data.contact.phone = data.contact.phone.toString().replace('(', '');
                // data.contact.phone = data.contact.phone.toString().replace(')', '');
                // data.contact.phone = data.contact.phone.toString().replace('-', '');
                data.contact.phone = data.contact.phone
                    .toString()
                    .replace('(', '')
                    .replace(')', '')
                    .replace('-', '');
                data.contact.phone = Number(data.contact.phone);
                contact_updated = await Contact.update(data.contact, {
                    where: { id: demand.Plaintiff.Person.Contact.id },
                    transaction
                });
            }

            let person_obj = {
                name: data.person.name,
                birth_date: data.person.birth_date,
                address: address_updated.id,
                contact: contact_updated.id
            };

            let person_updated = await Person.update(person_obj, {
                where: { id: demand.Plaintiff.Person.id },
                transaction
            });

            let physical_person_obj = {
                cpf: data.physical_person.cpf,
                rg: data.physical_person.cpf,
                person: person_updated.id,
                company: 1
            };

            let physical_person_updated = await PhysicalPerson.update(
                physical_person_obj,
                {
                    where: { id: demand.PhysicalPerson.id },
                    transaction
                }
            );

            let plaintiff_obj = {
                person: person_updated.id,
                institute_type: data.plaintiff.institute_type,
                institute_person: data.plaintiff.institute_person,
                relationship_type: data.plaintiff.relationship_type,
                relatives: data.plaintiff.relatives,
                note: data.plaintiff.note,
                institute_representative:
                    data.plaintiff.institute_representative
            };

            let paintiff_updated = await Plaintiff.update(plaintiff_obj, {
                where: { id: demand.plaintiff },
                transaction
            });

            data.plaintiff = paintiff_updated.id;
            // } else {
            //     data.plaintiff = data.plaintiff.id
            // }

            let demand_updated = await Demand.update(data, {
                where: {
                    id: req.params.id
                },
                transaction
            });

            if (data.DemandDocument) {
                await Promise.all(
                    data.DemandDocument.map(async value => {
                        if (value.id) {
                            await DemandDocument.update(value, {
                                where: {
                                    id: value.id
                                },
                                transaction
                            });
                        } else {
                            await DemandDocument.create(
                                {
                                    demand: demand.id,
                                    url: value.url
                                },
                                {
                                    transaction
                                }
                            );
                        }
                    })
                );
            }

            if (data.DemandGoal) {
                await Promise.all(
                    data.DemandGoal.map(async value => {
                        if (value.id) {
                            await DemandGoal.update(value, {
                                where: {
                                    id: value.id
                                },
                                transaction
                            });
                        } else {
                            await DemandGoal.create(
                                {
                                    demand: demand.id,
                                    goal: value.goal
                                },
                                {
                                    transaction
                                }
                            );
                        }
                    })
                );
            }

            if (data.DemandKeyword) {
                await Promise.all(
                    data.DemandKeyword.map(async value => {
                        value.demand = demand.id;
                        value.word = value.label;
                        await DemandKeyword.create(value, {
                            transaction
                        });
                    })
                );
            }

            if (data.DemandTask) {
                await Promise.all(
                    data.DemandTask.map(async value => {
                        await DemandTask.create(
                            {
                                demand: demand.id,
                                task: value.task
                            },
                            {
                                transaction
                            }
                        );
                    })
                );
            }

            if (data.DemandType) {
                await Promise.all(
                    data.DemandType.map(async value => {
                        if (!value.DemandType && !value.id && value.label) {
                            let obj = {
                                description: value.label
                            };
                            let type_stored = await DemandType.create(obj, {
                                transaction
                            });
                            let objType = {
                                demand: demand.id,
                                demand_type: type_stored.id
                            };
                            await DemandTypeDemand.create(objType, {
                                transaction
                            });
                        } else if (value.label) {
                            let objType = {
                                demand: demand.id,
                                demand_type: value.DemandType
                                    ? value.DemandType.id
                                    : value.id
                            };
                            await DemandTypeDemand.create(objType, {
                                transaction
                            });
                        }
                    })
                );
            }

            await transaction.commit();
            return res.json({
                demand
            });
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            return res.status(400).json({
                error: 'Error when updating demand'
            });
        }
    }

    async delete(req, res) {
        const demand = await Demand.findByPk(req.params.id);

        if (!demand)
            return res.status(400).json({
                error: 'This Demand does not exists!'
            });

        await demand.update({
            active: false
        });

        return res.status(200).json({
            message: 'Demand successfully deleted!'
        });
    }
}

export default new DemandController();
