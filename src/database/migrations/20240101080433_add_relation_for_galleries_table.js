/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('product_galleries', (table) => {
    table.foreign('product_id').references('id').inTable('products');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('product_galleries', (table)=> {
        table.dropForeign('product_id');
      })
};
