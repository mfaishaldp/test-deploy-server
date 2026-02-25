'use strict';

const { hashPassword } = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const movies = require('../data/movies.json').map(movie => {
      movie.createdAt = new Date()
      movie.updatedAt = new Date()
      return movie
    })
    const users = require('../data/users.json').map(user => {
      user.createdAt = new Date()
      user.updatedAt = new Date()
      user.password = hashPassword(user.password)
      return user
    })
    await queryInterface.bulkInsert('Users',users)
    await queryInterface.bulkInsert('Movies',movies)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Movies',null,{})
    await queryInterface.bulkDelete('Users',null,{})
  }
};
