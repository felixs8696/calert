import { Config } from './entities';

export default class RoutesConfig extends Config {
  configure() {
    this.$stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'client/templates/menu.html',
      controller: 'MenuCtrl as vm'
    })

    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'client/templates/login.html',
          controller: 'LoginCtrl as vm',
          resolve: {
            "currentUser": ["$meteor", function($meteor){
              return $meteor.waitForUser();
            }]
          }
        }
      }
    })

    .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'client/templates/search.html'
        }
      }
    })

    .state('app.main', {
        url: '/main',
        views: {
          'menuContent': {
            templateUrl: 'client/templates/main.html',
            controller: 'MainCtrl as vm',
            resolve: {
              "currentUser": ["$meteor", function($meteor){
                // Require the user to exist and have email validated to enter state
                return $meteor.requireValidUser((user) => {
                  if (user.emails[0].verified) {
                    return true;
                  }
                  return 'EMAIL_NOT_VALIDATED';
                });
              }]
            }
          }
        }
      })

    .state('app.map', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'client/templates/map.html',
          controller: 'MapCtrl as vm',
          resolve: {
            Map: ['$q', 'MeteorMapService', '$meteor', '$state', function($q, MeteorMapService, $meteor, $state) {
              // Wait for the user to exist and resolve the map in order to enter state
              var deferred = $q.defer();
              $meteor.waitForUser().then((user) => {
                MeteorMapService.getMap(user.profile.university, (map) => {
                  deferred.resolve(map);
                })
              });
        	    return deferred.promise;
         	  }],
            "currentUser": ["$meteor", function($meteor){
              // Require the user to exist and have email validated to enter state
              return $meteor.requireValidUser((user) => {
                if (user.emails[0].verified) {
                  return true;
                }
                return 'EMAIL_NOT_VALIDATED';
              });
            }]
          }
        }
      }
    })

    .state('app.chats', {
      url: '/chats',
      views: {
        'menuContent': {
          templateUrl: 'client/templates/chats.html',
          controller: 'ChatsCtrl as vm'
        }
      }
    })

    .state('app.chat', {
      url: '/chats/:chatId',
      views: {
        'menuContent': {
          templateUrl: 'client/templates/chat.html',
          controller: 'ChatCtrl as vm'
        }
      }
    })

    .state('app.single', {
      url: '/map/:playlistId',
      views: {
        'menuContent': {
          templateUrl: 'client/templates/playlist.html',
          controller: 'PlaylistCtrl'
        }
      }
    });

    this.$urlRouterProvider.otherwise('/app/map');
  }
}

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
