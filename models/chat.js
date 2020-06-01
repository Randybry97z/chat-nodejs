'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    user_a: DataTypes.STRING,
    user_b: DataTypes.STRING,
    body: DataTypes.TEXT
  }, {});
  Chat.associate = function(models) {
    // associations can be defined here
  };
  return Chat;
};