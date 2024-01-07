const {knex, Model} = require('./index.js');
require('dotenv').config();

class ProductGallery extends Model{
    constructor(product_id, url) {
        this.product_id = product_id;
        this.url = url;
    }

    static get tableName(){
        return 'product_galleries';
    }

    urlAttribute(){
        const prefix = process.env.URL_PREFIX;
        return prefix + this.url;
    }

}

module.exports = ProductGallery;