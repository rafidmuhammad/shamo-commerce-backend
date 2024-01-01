/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('transaction_items', (table) => {
    table.foreign('user_id').references('id').inTable('users');
    table.foreign('product_id').references('id').inTable('products');
    table.foreign('transaction_id').references('id').inTable('transactions');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('transaction_items', (table)=> {
        table.dropForeign('user_id');
        table.dropForeign('product_id');
        table.dropForeign('transaction_id');
      })
};
