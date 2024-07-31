const { knex, Model } = require('./index.js');

class Transaction extends Model {
    constructor(user_id, address, paymentMethod, totalPrice, totalShipping, status) {
        super();
        this.user_id = user_id;
        this.address = address;
        this.paymentMethod = paymentMethod;
        this.totalPrice = totalPrice;
        this.totalShipping = totalShipping;
        this.status = status;
    }

    static get tableName() {
        return 'transactions';
    }

    static get relationMappings() {
        const User = require('./userModel');
        const TransactionItem = require('./transactionItemModel');
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'transactions.user_id',
                    to: 'users.id'
                }
            },

            transactionItems: {
                relation: Model.HasManyRelation,
                modelClass: TransactionItem,
                join: {
                    from: 'transactions.id',
                    to: 'transaction_items.transaction_id'
                }
            }
        }
    }
}

module.exports = Transaction;