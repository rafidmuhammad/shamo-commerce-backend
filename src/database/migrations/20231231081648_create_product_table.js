/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('products', function(table){
    table.increments().primary();
    table.string('product_name');
    table.float('product_price');
    table.text('description').nullable();
    table.string('tags').nullable();
    table.bigInteger('category_id').notNullable();
    table.timestamps(true,true);
    table.timestamp('deleted_at').nullable();

  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('products');
};
