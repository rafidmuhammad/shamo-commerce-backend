/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTableIfNotExists('sessions', function (table) {
        table.increments().primary();
        table.integer('user_id').notNullable();
        table.string('token').notNullable();
        table.timestamp('expires_at').notNullable();
        table.boolean('is_valid').defaultTo(true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropSchemaIfExists('sessions');
};
