require('dotenv').config();


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
        directory: './src/database/migrations',
    },
    seeds: {
        directory: './src/database/seeds',
    },
};


const config={};

environment.forEach((env) => config[env] = {...commonConfig});

module.exports = config;