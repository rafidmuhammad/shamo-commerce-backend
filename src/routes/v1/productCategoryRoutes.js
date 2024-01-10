const express = require('express');
const router = express.Router();
const ResponseFormat = require('../responseFormat');
const ProductCategory = require('../../models/productCategoryModel');

router.get('/all', async function(req, res){
    const id = req.query.id;
    const show_product = req.query.show_product;
    const limit = req.query.limit;
    const name = req.query.name;

    try {
        let CategoryQuery = ProductCategory.query().withGraphFetched('products');
        let CategoryOut;
        let response;

        if(id){
            CategoryOut = await CategoryQuery.findById(id);

            if(CategoryOut){
                response = ResponseFormat.success({messageText : "Data successfully fetched", dataOut : CategoryOut});
                return res.json(response);
            }
            response = ResponseFormat.error({messageText : "Data not found", dataOut : CategoryOut, code : 404});
            return res.status(404).json(response);
        }

        CategoryQuery = ProductCategory.query();

        if(name){
            CategoryQuery = CategoryQuery.whereRaw('LOWER(product_name) LIKE ?', [`%${name.toLowerCase()}%`]);
        }

        if(show_product){
            CategoryQuery = CategoryQuery.withGraphFetched('products');
        }

        CategoryOut = await CategoryQuery.limit(limit ? limit : 10);

        if(CategoryOut.length === 0){
            response = ResponseFormat.error({code:404, messageText:"Data not available", dataOut:CategoryOut});
            return res.status(404).json(response);
        }
        else{
            response = ResponseFormat.success({messageText:"Data successfully fetched", dataOut:CategoryOut});
            return res.json(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error',
          });
    }
})

module.exports = router;