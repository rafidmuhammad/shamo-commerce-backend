const {knex, Model} = require('./index.js');


class UserModel extends Model{
    constructor(username, fullname, email, password, roles) {
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }

    static get tableName(){
        return 'users';
    }

    static get relationMappings(){
        const Transaction = require('./transactionModel');
        return{
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

module.exports = UserModel;