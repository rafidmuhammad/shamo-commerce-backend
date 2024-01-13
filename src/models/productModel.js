const { knex, Model } = require('./index.js');

class Product extends Model {

    static get tableName() {
        return 'products';
    }

    static get relationMappings() {
        const ProductGallery = require('./productGalleryModel');
        const ProductCategory = require('./productCategoryModel');
        return {
            galleries: {
                relation: Model.HasManyRelation,
                modelClass: ProductGallery,
                join: {
                    from: 'products.id',
                    to: 'product_galleries.product_id'
                }
            },

            category: {
                relation: Model.BelongsToOneRelation,
                modelClass: ProductCategory,
                join: {
                    from: 'products.category_id',
                    to: 'product_categories.id'
                }
            }
        }
    }
}

module.exports = Product;