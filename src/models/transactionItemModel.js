const {knex, Model} = require('./index.js');


class TransactionItem extends Model {
    constructor(user_id, product_id, transaction_id, quantity) {
        this.user_id = user_id;
        this.product_id = product_id;
        this.transaction_id = transaction_id;
        this.quantity = quantity;
    }


    static get tableName(){
        return 'transaction_items';
    }

    static get relationMappings(){
        const Product = require('./productModel');
        return{
            product: {
                relation: Model.BelongsToOneRelation,
                modelClass: Product,
                join: {
                    from: 'transactions_item.product_id',
                    to: 'products.id'
                }
            },
        }
    }
}

module.exports = {TransactionItem}