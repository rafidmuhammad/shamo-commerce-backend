/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('users', function(table){
    table.increments('id').primary();
    table.string('username').notNullable();
    table.string('fullname').notNullable();
    table.string('email_address').unique().notNullable();
    table.string('password').notNullable();
    table.enum('role', ['admin', 'user']).notNullable().defaultTo('user');
    table.timestamps(true,true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
