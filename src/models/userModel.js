const { knex, Model } = require('./index.js');


class User extends Model {

    static get tableName() {
        return 'users';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'fullname', 'email_address', 'password'],

            properties: {
                id: { type: 'integer' },
                username: { type: 'string', minLength: 1, maxLength: 255 },
                fullname: { type: 'string', minLength: 1, maxLength: 255 },
                email_address: { type: 'string', minLength: 1, maxLength: 255, format: 'email' },
                password: { type: 'string', minLength: 1, maxLength: 255 },
                role: { type: 'string' }
            }

        };
    }

    static get relationMappings() {
        const Transaction = require('./transactionModel');
        return {
            transactions: {
                relation: Model.HasManyRelation,
                modelClass: Transaction,
                join: {
                    from: 'users.id',
                    to: 'transactions.user_id'
                }
            },
        }
    }
}

module.exports = User;