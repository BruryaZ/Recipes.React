const User = require('../model/user')

const LoginDb = (Name, Password) => {

    return User.findOne({ where: { Name, Password } });
}

const SighinDb = (user) => {
    return User.create(user)
}

module.exports = { LoginDb, SighinDb };