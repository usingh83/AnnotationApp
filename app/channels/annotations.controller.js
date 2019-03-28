'use strict';

angular.module('annotationApp').controller('AnnotationsCtrl', function($state, profile, channelId, messageId, annotations,messageBody) {
  var annotationsCtrl = this;
  annotationsCtrl.note = '';
  annotationsCtrl.start = '';
  annotationsCtrl.end = '';
  annotationsCtrl.once = true;
  annotationsCtrl.annotations = annotations;
  annotationsCtrl.messageId = messageId;
  annotationsCtrl.channelId = channelId;
  annotationsCtrl.messageBody = messageBody;
  let body='',index=0;
  annotations.sort(function(a,b) {
    return a.start-b.start;
  });
  annotations.forEach(function(annotation) {
    if(annotation.uid!==profile.$id){
      return;
    }
    body+=messageBody.substring(index,parseInt(annotation.start));
    body+='{ '+messageBody.substring(parseInt(annotation.start),parseInt(annotation.end)+1)+' }';
    index=parseInt(annotation.end)+1;
  });
  body+=messageBody.substring(index,messageBody.length);
  annotationsCtrl.messageBody=body;
  annotationsCtrl.sendAnnotation = function() {
    if (annotationsCtrl.note.length > 0 && annotationsCtrl.messageId.length > 0) {
      annotationsCtrl.annotations.$add({
        uid: profile.$id,
        note: annotationsCtrl.note,
        start: annotationsCtrl.start,
        end: annotationsCtrl.end,
        messageId: annotationsCtrl.messageId,
        channelId: annotationsCtrl.channelId
      }).then(function() {
        annotationsCtrl.note = '';
        annotationsCtrl.start = 0;
        annotationsCtrl.end = 0;
        annotationsCtrl.messageId = '';
        annotationsCtrl.channelId = '';
        $state.go('channels.messages', { channelId: channelId });
      });
    }
  };
});

