const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const checkUserWithEmail = async (email) => {
    const userQuery = await User.query().where('email_address', email);
    const isExist = userQuery.length == 0 ? false : true;
    return userQuery;
}

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

async function validateUser(req, res, schema) {
    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    req.validatedData = value;

}

module.exports = { checkUserWithEmail, hashPassword, validateUser };