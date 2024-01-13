const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const checkUserWithEmail = async (email) => {
    const userQuery = await User.query().where('email_address', email);
    const isExist = userQuery.length == 0 ? false : true;
    return isExist;
}

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password,saltRounds);
}

module.exports = {checkUserWithEmail, hashPassword};