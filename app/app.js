'use strict';
/*global firebase*/
/**
 * @ngdoc overview
 * @name annotationApp
 * @description
 * # annotationApp
 *
 * Main module of the application.
 */
angular
  .module('annotationApp', [
    'firebase',
    'angular-md5',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/home.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireSignIn().then(function(){
              $state.go('channels');
            }, function(){
              return;
            });
          }
        }
      })
      .state('login', {
        url: '/login',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/login.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireSignIn().then(function(){
              $state.go('home');
            }, function(){
              return;
            });
          }
        }
      })
      .state('register', {
        url: '/register',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/register.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireSignIn().then(function(){
              $state.go('home');
            }, function(){
              return;
            });
          }
        }
      })
      .state('profile', {
        url: '/profile',
        controller: 'ProfileCtrl as profileCtrl',
        templateUrl: 'users/profile.html',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireSignIn().catch(function(){
              $state.go('home');
            });
          },
          profile: function(Users, Auth){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      })
      .state('channels', {
        url: '/channels',
        controller: 'ChannelsCtrl as channelsCtrl',
        templateUrl: 'channels/index.html',
        resolve: {
          channels: function (Channels){
            return Channels.$loaded();
          },
          profile: function ($state, Auth, Users){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded().then(function (profile){
                if(profile.displayName){
                  return profile;
                } else {
                  $state.go('profile');
                }
              });
            }, function(){
              $state.go('home');
            });
          }
        }
      })
      .state('channels.create', {
        url: '/create',
        templateUrl: 'channels/create.html',
        controller: 'ChannelsCtrl as channelsCtrl'
      })
      .state('channels.messages', {
        url: '/{channelId}/messages',
        templateUrl: 'channels/messages.html',
        controller: 'MessagesCtrl as messagesCtrl',
        resolve: {
          messages: function($stateParams, Messages){
            return Messages.forChannel($stateParams.channelId).$loaded();
          },
          channelName: function($stateParams, channels){
            return '#'+channels.$getRecord($stateParams.channelId).name;
          },
          channelId: function($stateParams){
            return $stateParams.channelId;
          }
        }
      })
      .state('channels.direct', {
        url: '/{uid}/messages/direct',
        templateUrl: 'channels/messages.html',
        controller: 'MessagesCtrl as messagesCtrl',
        resolve: {
          messages: function($stateParams, Messages, profile){
            return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
          },
          channelName: function($stateParams, Users){
            return Users.all.$loaded().then(function(){
              return '@'+Users.getDisplayName($stateParams.uid);
            });
          }
        }
      })
      .state('channels.messages.annotations', {
        url: '/{messageId}/annotations',
        templateUrl: 'channels/annotations.html',
        controller: 'AnnotationsCtrl as annotationsCtrl',
        resolve: {
          annotations: function($stateParams, Annotations, profile){
            return Annotations.forChannelMessage($stateParams.channelId,$stateParams.messageId,profile.$id).$loaded();
          },
          messageId: function($stateParams){
            return $stateParams.messageId;
          },
          channelId: function($stateParams){
            return $stateParams.channelId;
          },
          messageBody: function($stateParams,messages){
            return messages.$getRecord($stateParams.messageId).body;
          },
        }
      });

    $urlRouterProvider.otherwise('/');
  })
  .config(function(){
    // Replace this config with your Firebase's config.
    // Config for your Firebase can be found using the "Web Setup"
    // button on the top right of the Firebase Dashboard in the
    // "Authentication" section.

    let config = {
      apiKey: 'AIzaSyAY9E-5zCTf_pYFqCDorpqzGMtAra1Kdls',
      authDomain: 'virtualfacilitychallenge.firebaseapp.com',
      databaseURL: 'https://virtualfacilitychallenge.firebaseio.com',
      projectId: 'virtualfacilitychallenge',
      storageBucket: 'virtualfacilitychallenge.appspot.com',
      messagingSenderId: '116450825181'
    };

    firebase.initializeApp(config);
  })
  .constant('FirebaseUrl', 'https://virtualfacilitychallenge.firebaseio.com/');
