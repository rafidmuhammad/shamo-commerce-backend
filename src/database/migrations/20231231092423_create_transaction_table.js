/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('transactions', function(table){
    table.increments().primary();
    table.bigInteger('user_id');
    table.text('addres').nullable();
    table.string('payment_method').defaultTo('MANUAL');
    table.float('total_price').defaultTo(0);
    table.float('shipping_price').defaultTo(0);
    table.string('status').defaultTo('PENDING');
    table.timestamps(true,true);
    table.timestamp('deleted_at').nullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropSchemaIfExists('transactions');
};
