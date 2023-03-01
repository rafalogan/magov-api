import database from '../../database/index.js';
import Person from '../models/Person.js';
import PhysicalPerson from '../models/PhysicalPerson.js';
import CommentWarning from '../models/CommentWarning.js';
import PropositionTask from '../models/PropositionTask.js';

import TaskPlaintiff from '../models/TaskPlaintiff.js';
import Plaintiff from '../models/Plaintiff.js';

import Task from '../models/Task.js';
import TaskResponsible from '../models/TaskResponsible.js';
import User from '../models/User.js';
import content from './content.js';
import utils from './utils.js';
const sequelize = database.connection;
import { Op } from 'sequelize';
import Theme from '../models/Theme.js';
import Address from '../models/Address.js';
import Contact from '../models/Contact.js';
import DemandTask from '../models/DemandTask.js';
import Demand from '../models/Demand.js';
import Proposition from '../models/Proposition.js';

let include = [
    utils.include(CommentWarning, { active: true }),
    utils.include(
        TaskResponsible,
        { active: true },
        false,
        null,
        utils.include(
            PhysicalPerson,
            { active: true },
            false,
            null,
            utils.include(Person, { active: true }, false, null, null)
        )
    ),
    utils.include(
        PropositionTask,
        { active: true },
        false,
        null,
        utils.include(Proposition, { active: true })
    ),
    utils.include(
        DemandTask,
        { active: true },
        false,
        null,
        utils.include(Demand, { active: true })
    ),
    utils.include(Theme, { active: true }, false),
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
            utils.include(Person, { active: true }, false, null, [
                utils.include(
                    Address,
                    { active: true },
                    true,
                    null,
                    null,
                    null
                ),
                utils.include(Contact, { active: true }, true, null, null, null)
            ]),
            'pf'
        )
    )
];
class TaskController {
    async index(req, res) {
        try {
            let start = req.query.start
                ? req.query.start.replace(/T[0-9][0-9]/i, 'T00')
                : null;
            let end = req.query.end
                ? req.query.end.replace(/T[0-9][0-9]/i, 'T23')
                : null;
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
                };
            }

            let where = {
                active: true
            };
            let order = ['created_at', 'DESC'];

            if (dateWhere) {
                where[Op.or] = [
                    {
                        created_at: dateWhere
                    }
                ];
            }

            let unitWhere = req.query.unit;
            if (unitWhere) {
                where = {
                    ...where,
                    unit: unitWhere
                };
            }

            let checkWhere = req.query.check;
            if (checkWhere) {
                if (checkWhere == 'nivel_importancia') {
                    order = ['level', 'DESC'];
                } else if (checkWhere == 'pending') {
                    where = {
                        ...where,
                        status: 1
                    };
                } else if (checkWhere == 'doing') {
                    where = {
                        ...where,
                        status: 2
                    };
                } else if (checkWhere == 'concluded') {
                    where = {
                        ...where,
                        status: 3
                    };
                }
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
            }
            const task = await Task.findAll({
                order: [order],
                where: where,
                include
            });
            return res.json(content(task));
        } catch (e) {
            console.error(e);
        }
    }

    async getById(req, res) {
        const task = await Task.findOne({
            where: {
                id: req.params.id,
                active: true
            },
            include
        });

        return res.status(200).json({
            task
        });
    }

    async store(req, res) {
        try {
            let transaction = await sequelize.transaction();
            const data = req.body;

            if (new Date(data.end) < new Date(data.start)) {
                return res
                    .status(404)
                    .json({ error: 'Final date cannot be below start date!' });
            }

            data.cost = data.cost.toString();

            if (data.cost.includes('.')) {
                data.cost = data.cost.replace('.', '');
            }
            if (data.cost.includes('.')) {
                data.cost = data.cost.replace('.', '');
            }
            if (data.cost.includes('.')) {
                data.cost = data.cost.replace('.', '');
            }
            if (data.cost.includes(',')) {
                data.cost = data.cost.replace(',', '.');
            }

            let task_stored = await Task.create(data, {
                transaction
            });

            if (data.responsibles) {
                await Promise.all(
                    data.responsibles.map(async value => {
                        let objTaskResponsible = {
                            task: task_stored.id,
                            responsible: value.pf.id
                        };

                        await TaskResponsible.create(objTaskResponsible, {
                            transaction
                        });
                    })
                );
            }

            if (data.propositionTask && data.propositionTask.length > 0) {
                await Promise.all(
                    data.propositionTask.map(async value => {
                        let objPropositionTask = {
                            proposition: value.id,
                            task: task_stored.id
                        };
                        await PropositionTask.create(objPropositionTask, {
                            transaction
                        });
                    })
                );
            }
            if (data.demandTask && data.demandTask.length > 0) {
                await Promise.all(
                    data.demandTask.map(async value => {
                        let objDemandTask = {
                            demand: value.id,
                            task: task_stored.id
                        };
                        await DemandTask.create(objDemandTask, { transaction });
                    })
                );
            }

            if (data.contactParticipant) {
                // verifica se existe Participante

                await Promise.all(
                    data.contactParticipant.map(async value => {
                        if (value.plaintiff.id) {
                            // verifica se exite id

                            let objPlaintiffTask = {
                                plaintiff: value.plaintiff.id,
                                task: task_stored.id
                            };

                            await TaskPlaintiff.create(objPlaintiffTask, {
                                transaction
                            });
                            await transaction.commit();
                        } else {
                            //se não existe é necessario cadastrar o participante
                            if (
                                value.address.cep &&
                                value.contact.phone &&
                                value.person.name
                            ) {
                                value.address.cep = value.address.cep
                                    .toString()
                                    .replace('.', '');
                                value.address.cep = value.address.cep
                                    .toString()
                                    .replace('-', '');
                                let address_stored;
                                if (value.address.cep) {
                                    address_stored = await Address.create(
                                        value.address,
                                        {
                                            transaction
                                        }
                                    );
                                }

                                value.contact.phone = value.contact.phone
                                    .toString()
                                    .replace('(', '')
                                    .replace(')', '')
                                    .replace('-', '');
                                value.contact.phone = Number(
                                    value.contact.phone
                                );

                                let contact_stored = await Contact.create(
                                    value.contact,
                                    {
                                        transaction
                                    }
                                );

                                let person_obj = {
                                    name: value.person.name,
                                    birth_date: value.person.birth_date,
                                    address: address_stored.id,
                                    contact: contact_stored.id
                                };

                                let person_stored = await Person.create(
                                    person_obj,
                                    {
                                        transaction
                                    }
                                );

                                let physical_person_obj = {
                                    cpf: value.physical_person.cpf,
                                    person: person_stored.id,
                                    company: 1
                                };

                                let physical_person_stored = await PhysicalPerson.create(
                                    physical_person_obj,
                                    {
                                        transaction
                                    }
                                );

                                let paintiff_obj = {
                                    email: value.email,
                                    person: person_stored.id,
                                    institute_type: 1,
                                    institute_person: value.institute_person,
                                    relationship_type: value.relationship_type,
                                    relatives: value.relatives,
                                    note: value.note
                                };

                                let paintiff_stored = await Plaintiff.create(
                                    paintiff_obj,
                                    {
                                        transaction
                                    }
                                );

                                let objPlaintiffTask = {
                                    plaintiff: paintiff_stored.id,
                                    task: task_stored.id
                                };

                                await TaskPlaintiff.create(objPlaintiffTask, {
                                    transaction
                                });
                                await transaction.commit();
                            }
                        }
                        //  / fim if  de verificação
                    })
                );
            }

            return res.json(task_stored);
        } catch (e) {
            await transaction.rollback();
            console.log(e);
            return res.status(400).json({
                error: 'Erro saving record'
            });
        }
    }

    async changeStatus(req, res) {
        try {
            let transaction = await sequelize.transaction();
            let data = req.body;

            const task = await Task.findByPk(req.params.id);

            if (!task) {
                return res.status(404).json({
                    error: 'Task not found!'
                });
            }
            await Task.update(data, {
                where: {
                    id: req.params.id
                },
                transaction
            });

            await transaction.commit();
            return res.json({
                task
            });
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            return res.status(400).json({
                error: 'Error when updating task'
            });
        }
    }

    async update(req, res) {
        try {
            const data = req.body;

            let transaction = await sequelize.transaction();
            const task = await Task.findOne({
                where: {
                    id: req.params.id,
                    active: true
                },
                include
            });

            if (!task) {
                return res.status(404).json({ error: 'Task not found!' });
            }
            if (task.TaskResponsibles) {
                await Promise.all(
                    task.TaskResponsibles.map(async value => {
                        await TaskResponsible.destroy({
                            where: { id: value.id },
                            transaction
                        });
                    })
                );
                task.TaskResponsibles = [];
            }
            if (task.PropositionTasks) {
                await Promise.all(
                    task.PropositionTasks.map(async value => {
                        await PropositionTask.destroy({
                            where: { id: value.id },
                            transaction
                        });
                    })
                );
                task.PropositionTasks = [];
            }
            if (task.DemandTasks) {
                await Promise.all(
                    task.DemandTasks.map(async value => {
                        await DemandTask.destroy({
                            where: { id: value.id },
                            transaction
                        });
                    })
                );
                task.DemandTasks = [];
            }

            if (data.cost) {
                data.cost = data.cost.toString();
                if (data.cost.includes('.')) {
                    data.cost = data.cost.replace('.', '');
                }
                if (data.cost.includes('.')) {
                    data.cost = data.cost.replace('.', '');
                }
                if (data.cost.includes('.')) {
                    data.cost = data.cost.replace('.', '');
                }
                if (data.cost.includes(',')) {
                    data.cost = data.cost.replace(',', '.');
                }
            }

            await Task.update(data, {
                where: {
                    id: req.params.id
                },
                transaction
            });

            if (data.propositionTask.length > 0) {
                await Promise.all(
                    data.propositionTask.map(async value => {
                        let objPropositionTask = {
                            proposition: value.id,
                            task: task.id
                        };
                        await PropositionTask.create(objPropositionTask, {
                            transaction
                        });
                    })
                );
            }
            if (data.demandTask.length > 0) {
                await Promise.all(
                    data.demandTask.map(async value => {
                        let objDemandTask = {
                            demand: value.id,
                            task: task.id
                        };
                        await DemandTask.create(objDemandTask, { transaction });
                    })
                );
            }

            if (data.responsibles) {
                await Promise.all(
                    data.responsibles.map(async value => {
                        let objTaskResponsible = {
                            task: task.id,
                            responsible: value.physical_person
                                ? value.physical_person
                                : value.id
                        };
                        await TaskResponsible.create(objTaskResponsible, {
                            transaction
                        });
                    })
                );
            }

            await transaction.commit();
            return res.json({
                task
            });
        } catch (e) {
            console.log(e);
            await transaction.rollback();
            return res.status(400).json({
                error: 'Error updating record'
            });
        }
    }

    async delete(req, res) {
        const task = await Task.findByPk(req.params.id);

        if (!task)
            return res
                .status(400)
                .json({ error: 'This Task does not exists!' });

        await task.update({ active: false });
        return res.status(200).json({ message: 'Task successfully deleted!' });
    }
}

export default new TaskController();
