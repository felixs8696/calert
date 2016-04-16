Meteor.methods({
  newMessage(message) {
    check(message.text, String);
    check(message.chatId, String);

    message.timestamp = new Date();

    const messageId = Messages.insert(message);
    Chats.update(message.chatId, { $set: { lastMessage: message } });

    return messageId;
  }
});
