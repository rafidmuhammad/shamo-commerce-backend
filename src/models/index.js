const Knex = require('knex');
const config = require('../../knexfile');
const {Model} = require('objection');

const knex = Knex(config[process.env.NODE_ENV || 'development']);

Model.knex(knex);  

module.exports = {knex, Model};