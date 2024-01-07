const {knex, Model} = require('./index.js');

class ProductGallery extends Model{
    constructor(product_id, url) {
        this.product_id = product_id;
        this.url = url;
    }

    static get tableName(){
        return 'product_galleries';
    }

    //NOTE: need to add 'get url attribute'
}

module.exports = ProductGallery;