'use strict';
const socket = require('../realtime/client')

module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('chat', {
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

  Chat.afterCreate(function (chat,options) {
    socket.emit('new_message',chat)
  })
  return Chat;
};