const User = require('../model/user')

const LoginDb = (Name, Password) => {

    return User.findOne({ where: { Name, Password } });
}

const SighinDb = (user) => {
    return User.create(user)
}

const GetUsersDb = () => {
    return User.findAll()
}

module.exports = { LoginDb, SighinDb, GetUsersDb };