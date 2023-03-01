'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('institute_type', [
      {
        id: 1,
        name: "Cidadão",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 2,
        name: "Empresa",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 3,
        name: "Movimento",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 4,
        name: "Militância",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 5,
        name: "ONG",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 6,
        name: "Orgãos Públicos",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 7,
        name: "Partido",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 8,
        name: "Político",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 9,
        name: "Sindicato",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('institute_type', null, {});
  }
};