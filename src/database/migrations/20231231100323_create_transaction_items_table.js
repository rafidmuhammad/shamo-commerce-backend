/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('transaction_items', function(table){
    table.increments().primary();
    table.bigInteger('user_id');
    table.bigInteger('product_id');
    table.bigInteger('transaction_id');
    table.bigInteger('quantity');
    table.timestamps(true,true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  knex.schema.dropTableIfExists('transaction_items');
};
