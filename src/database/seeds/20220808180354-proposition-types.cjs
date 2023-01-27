'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('proposition_type', [
      {
        id: 1,
        description: "Comunicados",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 2,
        description: "Contratos",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 3,
        description: "Edital",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 4,
        description: "Emenda",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 5,
        description: "Licitação",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 6,
        description: "Oficio",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 7,
        description: "Projeto de Lei",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 8,
        description: "Questão de Ordem",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 9,
        description: "Recurso",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 10,
        description: "Requerimento",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 11,
        description: "Emenda de Lei",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 12,
        description: "Emenda Orçamentária",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 13,
        description: "Emenda Complementar",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 14,
        description: "PEC",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('proposition_type', null, {});
  }
};