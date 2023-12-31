/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('product_galleries', function(table){
    table.increments().primary();
    table.bigInteger('product_id');
    table.string('url');
    table.timestamps(true,true);
    table.timestamp("deleted_at").nullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('product_galleries');
};
