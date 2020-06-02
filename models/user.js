'use strict';

const bcrypt = require('bcrypt')


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password_hash: DataTypes.STRING,
    password: DataTypes.STRING,
    nickname: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: false
    },
    avatar: DataTypes.STRING
  }, {});
  User.login = function (nickname,password) {
    //Buscar usuario
    return User.findOne({
      where: {
        nickname
      }
    }).then(user=>{
      if (!user) return null
      return user.authenticatePassword(password).then(valid=>{
        if (valid) return user
        return null
      })
    })
  }
  //Comparar password
  User.prototype.authenticatePassword = function(password){
    return new Promise((res,rej)=>{
      bcrypt.compare(password, this.password_hash, function (err,valid) {
        if (err) return rej(err)

        res(valid)
      })
    })
  }
  User.associate = function(models) {
    // associations can be defined here
  };
    User.beforeCreate(function (user,options) {
    return new Promise((res,rej)=>{
      if (user.password) {
        bcrypt.hash(user.password, 10, function (error,hash) {
          user.password_hash = hash
          res()
        })
      }
    })
  })
  return User;
};