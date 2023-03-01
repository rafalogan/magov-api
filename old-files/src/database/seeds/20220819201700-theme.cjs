'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('theme', [
      {
        id: 1,
        description: "Audiência ",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 2,
        description: "Segurança",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 3,
        description: "Educação",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 4,
        description: "Infraestrutura",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 5,
        description: "Transporte",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 6,
        description: "Assistência Social",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 7,
        description: "Cultura e Arte",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 8,
        description: "Economia",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 9,
        description: "Comunicação",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 10,
        description: "Ciência e Tecnologia",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 11,
        description: "Saúde",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 12,
        description: "Eventos",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 13,
        description: "Meio Ambiente",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      },
      {
        id: 14,
        description: "Novo:_______",
        active: true,
        created_at: "2022-08-08 11:28:46",
        updated_at: "2022-08-08 11:28:46"
      }
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('theme', null, {});
  }
};