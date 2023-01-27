import content from './content.js';
import CapagCity from '../models/CapagCity.js';
import CapagState from '../models/CapagState.js';
// import { readFile } from "fs/promises";
// import { readFile } from "node:fs/promises";

import database from '../../database/index.js';
const sequelize = database.connection;

// import CitiesCapag from '../../documents/CAPAGMunicipiosAnoBase2022.json'
// import StatesCapag from '../../documents/CAPAGESTADOS202111.json'

class MandateDataController {
  async getCitiesCapag(req, res) {
    try {

      const cities = await CapagCity.findAll({
        order: ['id'],
        where: { active: true }
      });
      return res.json(
        content(cities)
      );
    } catch (e) {
      console.log(e)
    }
  }
  async getStateCapag(req, res) {
    try {

      const state = await CapagState.findAll({
        order: ['id'],
        where: { active: true }
      });
      return res.json(
        content(state)
      );
    } catch (e) {
      console.log(e)
    }
  }

  async storeCity(req, res) {

    try {
      let transaction = await sequelize.transaction();
      // const states = JSON.parse(await readFile("src/documents/CAPAGESTADOS202111.json"));
      // const cities = JSON.parse(await readFile("src/documents/CAPAGMunicipiosAnoBase2022.json"));
      return res.json({}) //Para atualizar a Tabela no banco comente esse console
      // Salvar estados 
      await Promise.all(states.Planilha1.map(async (value) => {
        let obj = {
          uf: value.UF,
          ind_1: value.Indicador1,
          ind_2: value.Indicador2,
          ind_3: value.Indicador3,
          grade_capag: value.CAPAG,
        }
        try {
          await CapagState.create(obj, {
            transaction
          });

        } catch (e) {
          console.log(e)
        }
      }));
      //Salvar cidades
      await Promise.all(cities.cidades.map(async (value, index) => {
        try {
          let obj = {
            city: value.Instituição,
            uf: value.UF,
            ibge_code: value.cod_ibge,
            population: value.populacao ? value.populacao : 0,
            ind_1: value.Indicador_1 ? value.Indicador_1.toFixed(7) : 0,
            ind_2: value.Indicador_2 && value.Indicador_2 != "#NUM!" ? value.Indicador_2.toFixed(7) : 0,
            ind_3: value.Indicador_3 ? value.Indicador_3.toFixed(7) : 0,
            grade_1: value.Nota_1,
            grade_2: value.Nota_2,
            grade_3: value.Nota_3,
            grade_capag: value.CAPAG_2022,
          }
          if (obj.ind_1 > 1000000000) {
            obj.ind_1 = 0
          }
          if (obj.ind_2 > 1000000000) {
            obj.ind_2 = 0
          }
          if (obj.ind_3 > 1000000000) {
            obj.ind_3 = 0
          }

          await CapagCity.create(obj, {
            transaction
          });
        } catch (e) {
          console.log(e)
        }
      }));

      await transaction.commit();
      return res.json({

      })
    } catch (error) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Erro ao salvar registro'
      });
    }
  }

}

export default new MandateDataController();
