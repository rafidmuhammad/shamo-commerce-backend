const express = require('express');
const router = express.Router();
const ResponseFormat = require('../responseFormat');
const Product = require('../../models/productModel');

router.get('/all', async function(req, res){
    const id = req.query.id;
    const name=req.query.name;
    const limit=req.query.limit;
    const tag=req.query.tag;
    const category=req.query.category;
    const priceFrom=req.query.priceFrom;
    const priceTo = req.query.priceTo;

    try {
        let productQuery = Product.query().withGraphFetched('[galleries, category]');
        let productOut;
        let response;

        if(id){
            productOut = await productQuery.findById(id);
            console.log(productOut);
            if(productOut !== undefined){
                response = ResponseFormat.success({messageText:"Data successfully fetched", dataOut:productOut});
                return res.json(response);
            }
            response = ResponseFormat.error({code:404, messageText:"Data not available", dataOut:productOut});
            return res.status(response.meta.code).json(response);
        }


        if(name){
             productQuery = productQuery.whereRaw('LOWER(product_name) LIKE ?', [`%${name.toLowerCase()}%`]);
        }

        if(tag){
            productQuery = productQuery.orWhereRaw('LOWER(tags) LIKE ?', [`%${tag.toLowerCase()}%`]);
        }

        if(priceFrom){
            productQuery = productQuery.orWhere('product_price', '>=', priceFrom);
        }

        if(priceTo){
            productQuery = productQuery.orWhere('product_price', '<=', priceTo);
        }

        if(category){
            productQuery = productQuery.orWhere('category_id', category);
        }

        productOut = await productQuery.limit(limit ? limit : 10);

        if(productOut.length === 0){
            response = ResponseFormat.error({code:404, messageText:"Data not available", dataOut:productOut});
            return res.status(404).json(response);
        }
        else{
            response = ResponseFormat.success({messageText:"Data successfully fetched", dataOut:productOut});
            return res.json(response);
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error',
          });
    }
  });

module.exports = router;