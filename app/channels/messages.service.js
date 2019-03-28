'use strict';
/*global firebase*/
angular.module('annotationApp')
  .factory('Messages', function($firebaseArray){
    var channelMessagesRef = firebase.database().ref('channelMessages');
    var userMessagesRef = firebase.database().ref('userMessages');

    return {
      forChannel: function(channelId){
        return $firebaseArray(channelMessagesRef.child(channelId));
      },
      getMessage: function(channelId,messageId){
        return channelMessagesRef.$getRecord(channelId+'/'+messageId).body;
      },
      forUsers: function(uid1, uid2){
        var path = uid1 < uid2 ? uid1+'/'+uid2 : uid2+'/'+uid1;

        return $firebaseArray(userMessagesRef.child(path));
      }
    };
  });
