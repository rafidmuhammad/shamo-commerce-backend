const {knex, Model} = require('./index.js');


class ProductCategory extends Model{
    constructor(productName) {
        this.productName = productName;
    }

    static get tableName(){
        return 'product_categories';
    }

    static get relationMappings(){
        const Product = require('./productModel');
        return{
            transactions: {
                relation: Model.HasManyRelation,
                modelClass: Product,
                join: {
                    from: 'product_categories.id',
                    to: 'products.category_id'
                }
            },
        }
    }
}