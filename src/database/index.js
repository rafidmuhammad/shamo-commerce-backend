const knex = require('knex');
const config = require('../../knexfile');

const database = knex(config[process.env.NODE_ENV || 'development']);

module.exports = database;