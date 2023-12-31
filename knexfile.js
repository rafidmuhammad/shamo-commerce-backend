require('dotenv').config();
const knex = require('knex');

const environment = ['development', 'staging', 'production'];


const connection = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

const commonConfig = {
    client:'pg',
    connection: connection,
    pool: {
        min: 2,
        max: 10,
      },
    migrations: {
        tableName: 'knex_migrations',
        directory: './migrations',
    },
    seeds: {
        directory: './seeds',
    },
};


module.exports = environment.map((env) => {return {environment:env, ...commonConfig}});
