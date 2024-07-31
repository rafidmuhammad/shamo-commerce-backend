const Product = require('../models/productModel');
const ResponseFormat = require('../routes/responseFormat');


// Custom validation function to check if an element exists
const elementExists = async (id) => {
    const res = await Product.query().where('id', id);
    if (res.length === 0) {
        throw new Error(`Element with id ${id} does not exist`);
    }
};

async function validateData(req, res, schema) {
    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    req.validatedData = value;

}

module.exports = { elementExists, validateData };
