import Company from '../models/Company.js';
import Person from '../models/Person.js';
import PhysicalPerson from '../models/PhysicalPerson.js';
import Plaintiff from '../models/Plaintiff.js';
import Address from '../models/Address.js';
import InstituteType from '../models/InstituteType.js';
import content from './content.js';
import utils from './utils.js';
import database from '../../database/index.js';
import Demand from '../models/Demand.js';
import Contact from '../models/Contact.js';

const sequelize = database.connection;

class PlaintiffController {

    async index(req, res) {

        let include = [

            utils.include(InstituteType, {
                active: true
            }),
            utils.include(Person, {
                active: true,
            }, false, null,
                [
                    utils.include(PhysicalPerson, {
                        active: true
                    }, false, null,
                        utils.include(Company, {
                            active: true
                        })),
                    utils.include(Address, {
                        active: true
                    }),
                    utils.include(Contact, {
                        active: true
                    })
                ]
            ),
            utils.include(Demand, {
                active: true
            }, false),
        ];

        const plaintiff = await Plaintiff.findAll({
            order: ['id'],
            where: {
                active: true
            },
            include
        });

        return res.json(
            content(plaintiff)
        )
    }

    async getByDoc(req, res) {
        let wherePerson = { active: true }

        let include = [

            utils.include(Plaintiff, {
                active: true
            }, false, null,
                utils.include(Person, wherePerson,

                    false, null,
                    [
                        utils.include(PhysicalPerson, {
                            active: true
                        }, false, null,
                            utils.include(Company, {
                                active: true
                            })),
                        utils.include(Address, {
                            active: true
                        }),
                        utils.include(Contact, {
                            active: true
                        })
                    ]
                )


            )
        ]

        const physicalPerson = await PhysicalPerson.findOne({
            where: {
                cpf: req.body.doc,
                active: true,
            },

        })

        const company = await Company.findOne({
            where: {
                cnpj: req.body.doc,
                active: true,
            },

        })

        const demand = await Demand.findOne({
            where: {
                active: true,
            }, include
        })
        if (company) {
            wherePerson.person = company.person

            return res.status(200).json(demand)
        } else if (physicalPerson) {
            wherePerson.person = physicalPerson.person
            return res.status(200).json(demand)
        } else {
            return res.status(400).json({
                message: 'Documento não encontrado'
            })
        }
        return res.status(200).json({
            demand
        });
    }

    async getById(req, res) {

        let include = [
            utils.include(InstituteType, {
                active: true
            }),
            utils.include(Person, {
                active: true,
            }, false, null,
                [
                    utils.include(PhysicalPerson, {
                        active: true
                    }, false, null,
                        utils.include(Company, {
                            active: true
                        })),
                    utils.include(Address, {
                        active: true
                    })
                ]
            )
        ];

        const plaintiff = await Plaintiff.findOne({
            where: {
                id: req.params.id,
                active: true
            }, include
        });

        return res.status(200).json(
            plaintiff
        );
    }

    async store(req, res) {
        //let data = req.body;
        //return res.json(await Plaintiff.create(data));
        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            data.address.cep = data.address.cep.toString().replace('.', '');
            data.address.cep = data.address.cep.toString().replace('-', '');

            let address_stored = await Address.create(data.address, {
                transaction
            });

            data.contact.phone = data.contact.phone.toString().replace('(', '').replace(')', '').replace('-', '');
            data.contact.phone = Number(data.contact.phone)

            let contact_stored = await Contact.create(data.contact, {
                transaction
            });

            let person_obj = {
                name: data.person.name,
                birth_date: data.person.birth_date,
                address: address_stored.id,
                contact: contact_stored.id,

            }

            let person_stored = await Person.create(person_obj, {
                transaction
            });

            let physical_person_obj = {
                cpf: data.physical_person.cpf,
                person: person_stored.id,
                company: 1
            }

            let physical_person_stored = await PhysicalPerson.create(physical_person_obj, {
                transaction
            });

            let paintiff_obj = {
                email: data.email,
                person: person_stored.id,
                institute_type: 1,
                institute_person: data.institute_person,
                relationship_type: data.relationship_type,
                relatives: data.relatives,
                note: data.note,
                // institute_representative: data.institute_representative
            }

            let paintiff_stored = await Plaintiff.create(paintiff_obj, {
                transaction
            });

            await transaction.commit();

            return res.json(paintiff_stored);

        } catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao salvar registro'
            });
        }
    }
    async update(req, res) {
        let transaction = await sequelize.transaction();
        try {
            let data = req.body

            data.address.cep = data.address.cep.toString().replace('.', '');
            data.address.cep = data.address.cep.toString().replace('-', '');

            let address_updated = await Address.update(data.address, {
                where: { id: data.address.id },
                transaction
            })

            data.contact.phone = data.contact.phone.toString().replace('(', '').replace(')', '').replace('-', '');
            data.contact.phone = Number(data.contact.phone)

            let contact_updated = await Contact.update(data.contact, {
                where: { id: data.contact.id },
                transaction
            })

            let person_obj = {
                name: data.person.name,
                birth_date: data.person.birth_date,
                address: address_updated.id,
                contact: contact_updated.id,
            }

            let person_updated = await Person.update(person_obj, {
                where: { id:  data.Person.id },
                transaction
            })
            let physical_person_obj = {
                id: data.Person.PhysicalPerson.id,
                cpf: data.physical_person.cpf,
                person: person_updated.id,
                company: 1
            }

            let physical_person_updated = await PhysicalPerson.update(physical_person_obj, {
                where: { id: data.Person.PhysicalPerson.id },
                transaction
            })

            let paintiff_obj = {
                email: data.email,
                person: person_updated.id,
                institute_type: 1,
                institute_person: data.institute_person,
                relationship_type: data.relationship_type,
                relatives: data.relatives,
                note: data.note,
                // institute_representative: data.institute_representative
            }

            let paintiff_updated = await Plaintiff.update(paintiff_obj, {
                where: { id: data.id },
                transaction
            })

            await transaction.commit();

            return res.json(paintiff_updated);
        }
        catch (error) {
            await transaction.rollback();
            return res.status(400).json({
                error: 'Erro ao salvar registro'
            });
        }
    }

    async delete(req, res) {
        const plaintiff = await Plaintiff.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!plaintiff) {
            return res.status(400).json({
                error: 'This Plaintiff not exist!'
            });
        }

        await plaintiff.update({
            active: false
        });

        return res.status(400).json({
            message: 'Plaintiff  successfully deleted!'
        })
    }
}

export default new PlaintiffController();
