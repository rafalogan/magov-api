import Squad from '../models/Squad.js';
import SquadUser from '../models/SquadUser.js';
import content from './content.js';
import utils from './utils.js';
import database from '../../database/index.js';
import User from '../models/User.js';

const sequelize = database.connection;

class SquadController {

    async index(req, res) {

        let include = [
            utils.include(SquadUser, {active: true}, false, null,
                utils.include(User, {active: true}))
        ];

        const squad = await Squad.findAll({
            order: ['id'],
            where: {
                active: true
            },
            include
        });

        return res.json(content(squad));
    }

    async getById(req, res) {
        let include = [
            utils.include(SquadUser, {active: true}, false, null,
                utils.include(User, {active: true}))
        ];

        const squad = await Squad.findOne({
            where: {
                id: req.params.id,
                active: true
            },
            include
        });

        return res.status(200).json({
            squad
        });
    }

    async store(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body;

            let squad_stored = await Squad.create(data, {
                transaction
            });

            if (data.SquadUser) {
                await Promise.all(data.SquadUser.map(async (value) => {
                    value.squad = squad_stored.id;
                    await SquadUser.create(value, {
                        transaction
                    });
                }));
            }
            await transaction.commit();

            return res.json(squad_stored);
        } catch (error) {
            await transaction.rollback();
            console.log(error)
            return res.status(400).json({
                error: 'Error saving record'
            })
        }

    }

    async update(req, res) {

        const squad = await Squad.findByPk(req.params.id);

        if (!squad) {
            return res.status(404).json({
                error: 'Squad not found!'
            });
        }

        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            await squad.update(data, {
                transaction
            })

            if (data.SquadUser) {
                await Promise.all(data.SquadUser.map(async (value) => {
                    if (value.id) {
                        await SquadUser.update(value, {
                            where: {
                                id: value.id
                            },
                            transaction
                        })
                    } else {
                        await SquadUser.create({
                            squad: squad.id,
                            user: value.user
                        }, {
                            transaction
                        })
                    }

                }));
            }

            if (data.SquadUserRemove) {
                await Promise.all(data.SquadUserRemove.map(async (value) => {
                    await SquadUser.update({
                        active: false
                    }, {
                        where: {
                            id: value.id
                        },
                        transaction
                    })

                }));
            }

            await transaction.commit();
            return res.json({
                squad
            })
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            return res.status(400).json({
                error: 'Error when updating squad'
            })
        }
    }

    async delete(req, res) {

        const squad = await Squad.findByPk(req.params.id);

        if (!squad)
            return res.status(400).json({
                error: 'This Squad does not exists!'
            });

        await squad.update({
            active: false
        });

        return res.status(200).json({
            message: 'Squad successfully deleted!'
        });
    }
}

export default new SquadController();
