import Unitt from '../models/Unit.js';
import Address from '../models/Address.js';
import Company from '../models/Company.js';
import content from './content.js';
import Contact from '../models/Contact.js';
import utils from './utils.js';
import database from '../../database/index.js';

const sequelize = database.connection;

class UnitController {

    async index(req, res) {

        let include = [
            utils.include(Address, { active: true }),
            utils.include(Company, { active: true })
        ];

        const uni = await Unitt.findAll({
            order: ['id'],
            where: { active: true },
            include
        });

        return res.json(
            content(uni)
        )
    }

    async getById(req, res) {

        let include = [
            utils.include(Address, { active: true }),
            utils.include(Company, { active: true })
        ];

        const uni = await Unitt.findAll({
            where: {
                id: req.params.id,
                active: true
            },
            include
        })

        return res.status(200).json({
            uni,
        })
    }

     async store(req, res) {
         let transaction = await sequelize.transaction();
         try {
             let data = req.body

              data.address.cep = data.address.cep.toString().replace('.', '');
              data.address.cep = data.address.cep.toString().replace('-', '');
              
              let address_stored = await Address.create(data.address, {
                  transaction
              });

              let contact_stored = await Contact.create(data.contact, {
                transaction
            });


              let unit_obj = {
                  address: address_stored.id,
                  contact: contact_stored.id,
                  company: 1,
                  federative_level: data.federative_level,
              }

             let unit_stored = await Unitt.create(unit_obj, {
                 transaction
             });

             await transaction.commit();

             return res.json(unit_stored);

         } catch (error) {
             await transaction.rollback();
             return res.status(400).json({
                 error: 'Erro ao salvar registro'
             });
         }
     }

}

export default new UnitController();
