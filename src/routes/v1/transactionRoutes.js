const express = require('express');
const router = express.Router();
const ResponseFormat = require('../responseFormat');
const Transaction = require('../../models/transactionModel');
const TransactionItem = require('../../models/transactionItemModel');
const verifyToken = require('../../middleware/verifyToken');
const { elementExists, validateData } = require('../../helper/transactionHelper');
const Joi = require('joi');

router.get('/all', verifyToken, async function (req, res) {
  const id = req.query.id;
  const status = req.query.status;
  const limit = req.query.limit;

  try {
    const userId = req.user.id;
    let transactionQuery = Transaction.query().withGraphFetched('transactionItems.product');
    let response;
    let transactionOut;

    transactionQuery = transactionQuery.where('user_id', userId);

    if (id) {
      transactionOut = await transactionQuery.findById(id);
      if (transactionOut) {
        response = ResponseFormat.success({ messageText: "Data successfully fetched", dataOut: transactionOut });
        return res.json(response);
      }
      response = ResponseFormat.error({ code: 404, messageText: "Data not available", dataOut: transactionOut });
      return res.status(response.meta.code).json(response);
    }

    if (status) {
      transactionQuery = transactionQuery.andWhereILike('status', status);
    }

    transactionOut = await transactionQuery.limit(limit ? limit : 10);

    response = ResponseFormat.success({
      code: 200,
      messageText: "Success",
      dataOut: transactionOut
    })

    return res.status(response.meta.code).json(response);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});



router.post('/checkout', verifyToken, async function (req, res) {

  const statusEnum = ['PENDING', 'SUCCESS', 'CANCELLED', 'FAILED', 'SHIPPING', 'SHIPPED'];

  const transactionSchema = Joi.object({
    items: Joi.array().items(
      Joi.object({
        id: Joi.number().integer().required(),
        quantity: Joi.number().integer().required()
      })
    ).required(),
    address: Joi.string().required(),
    status: Joi.string().valid(...statusEnum).required(),
    total_price: Joi.number().required(),
    shipping_price: Joi.number().required(),
  });


  try {

    const userid = req.user.id;

    // Step 1: Validate the data structure
    await validateData(req, res, transactionSchema);
    const validatedData = req.validatedData;

    // Step 2: Check existence of product IDs
    await Promise.all(validatedData.items.map(async item => {
      await elementExists(item.id);
    }));

    // Step 3: Proceed with transaction creation
    const transactionData = {
      user_id: userid,
      addres: validatedData.address,
      status: validatedData.status,
      total_price: validatedData.total_price,
      shipping_price: validatedData.shipping_price
    };

    // Insert the transaction
    const newTransaction = await Transaction.query().insert(transactionData);


    // Insert each transaction item
    for (const element of validatedData.items) {
      const transactionItemData = {
        user_id: userid,
        product_id: element.id,
        transaction_id: newTransaction.id,
        quantity: element.quantity,
      };

      await TransactionItem.query().insert(transactionItemData);
    }

    const transactionOut = await Transaction.query()
      .withGraphFetched('transactionItems.product')
      .where('user_id', userid);

    const response = ResponseFormat.success({
      code: 200,
      messageText: "Success",
      dataOut: transactionOut
    });

    return res.status(response.meta.code).json(response);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});



module.exports = router;