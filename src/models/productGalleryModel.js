const { knex, Model } = require('./index.js');
require('dotenv').config();

class ProductGallery extends Model {

    static get tableName() {
        return 'product_galleries';
    }

    urlAttribute() {
        const prefix = process.env.URL_PREFIX;
        // return prefix + this.url;
    }

}

module.exports = ProductGallery;