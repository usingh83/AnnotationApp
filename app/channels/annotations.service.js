/*global firebase*/
'use strict';

angular.module('annotationApp')
  .factory('Annotations', function($firebaseArray){
    var channelMessageAnnotationsRef = firebase.database().ref('channelMessageAnnotations');
    return {
      forChannelMessage: function(channelId,messageId,uid){
        return $firebaseArray(channelMessageAnnotationsRef.child(channelId+'/'+messageId+'/'+uid));
      }
    };
  });
