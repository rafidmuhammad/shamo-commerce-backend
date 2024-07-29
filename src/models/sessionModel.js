const { knex, Model } = require('./index.js');

class Sessions extends Model {

    static get tableName() {
        return 'sessions';
    }

    static get relationMappings() {
        const User = require('./userModel');
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'sessions.user_id',
                    to: 'users.id'
                }
            },
        }
    }

}

module.exports = Sessions;