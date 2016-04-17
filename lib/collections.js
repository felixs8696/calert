Chats = new Mongo.Collection('chats');
Messages = new Mongo.Collection('messages');

Chats.allow({
  insert(userId, chat) {
    return userId && chat;
  },
  update(userId, chat, fields, modifier) {
    return userId && chat;
  },
  remove(userId, chat) {
    return userId && chat;
  }
});

Messages.allow({
  insert(userId, chat) {
    return userId && chat;
  },
  update(userId, chat, fields, modifier) {
    return userId && chat;
  },
  remove(userId, chat) {
    return userId && chat;
  }
});
