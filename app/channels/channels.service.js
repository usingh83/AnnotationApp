'use strict';
/*global firebase*/
angular.module('annotationApp')
  .factory('Channels', function($firebaseArray){
    var ref = firebase.database().ref('channels');
    var channels = $firebaseArray(ref);

    return channels;
  });
