/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.table('sessions', (table) => {
        table.foreign('user_id').references('id').inTable('users');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.table('sessions', (table) => {
        table.dropForeign('user_id');
    })
};
