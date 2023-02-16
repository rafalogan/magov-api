'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('origin', [
      {
        id: 1,
        description: "Emenda Orçamentária",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 2,
        description: "Extra Orçamentária",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 3,
        description: "Originária (origem de atividade própria)",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 4,
        description: "Derivativa (tributos e multas)",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 5,
        description: "Transferidas Obrigatórias Federal",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 6,
        description: "Transferidas Obrigatórias Estadual",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 7,
        description: "Arrecadação de Imposto Municipal",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 8,
        description: "Outras Receitas",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      }
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('origin', null, {});
  }
};