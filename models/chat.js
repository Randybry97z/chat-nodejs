'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    user_b: DataTypes.STRING,
    body: DataTypes.TEXT
  }, {});
  Chat.associate = function(models) {
    // associations can be defined here
    Chat.belongsTo(models.User,{
  		as: 'user',
      foreignKey: 'userId'
  	})
  };
  return Chat;
};