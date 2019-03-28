'use strict';
/*global firebase*/
angular.module('annotationApp')
  .controller('MessagesCtrl', function(profile, channelName, channelId, messages, Messages) {
    var messagesCtrl = this;

    messagesCtrl.messages = messages;
    messagesCtrl.channelName = channelName;
    messagesCtrl.channelId = channelId;
    messagesCtrl.message = '';
    messagesCtrl.getMessage = Messages.getMessage;
    messagesCtrl.sendMessage = function() {
      if (messagesCtrl.message.length > 0) {
        messagesCtrl.messages.$add({
          uid: profile.$id,
          body: messagesCtrl.message,
          channelId: messagesCtrl.channelId,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(function() {
          messagesCtrl.message = '';
        });
      }
    };
  });
