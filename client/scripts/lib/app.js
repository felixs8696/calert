// Libs
import angular from 'angular';
import 'angular-animate';
import 'angular-meteor';
import 'angular-moment';
import 'angular-sanitize';
import 'angular-ui-router';
import 'ionic-scripts';
import 'angular-simple-logger';
import 'angular-google-maps';
import 'angular-loading-bar';
import Definer from '../definer';
import RoutesConfig from '../routes';
import MenuCtrl from '../controllers/menu.controller';
import PlaylistCtrl from '../controllers/playlist.controller';
import MapCtrl from '../controllers/map.controller';
import LoginCtrl from '../controllers/login.controller';
import MainCtrl from '../controllers/main.controller';
import ChatsCtrl from '../controllers/chats.controller';
import GlobalCtrl from '../controllers/global.controller';
import Login from '../services/login.service';
import MapService from '../services/map.service';
import MeteorMapService from '../services/map.meteor.service';
import IntervalService from '../services/interval.service';
import SessionService from '../services/session.service';
import MarkerIconService from '../services/markericon.service';
import NavigationService from '../services/navigation.service';
import DateFilter from '../filters/date.filter';
import ChatCtrl from '../controllers/chat.controller';
import InputDirective from '../directives/input.directive';

// Modules

// App
const App = angular.module('calert', [
  'angular-meteor',
  'ngAnimate',
  'angularMoment',
  'accounts.ui',
  'ionic',
  'nemLogging',
  'uiGmapgoogle-maps',
  'cfp.loadingBar'
]).config(['uiGmapGoogleMapApiProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', function(uiGmapGoogleMapApiProvider, $urlRouterProvider, cfpLoadingBarProvider) {
  uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyCS91b3IpVVqYikQ69nNdoz_Za9S98qt8A',
      v: '3.24', //defaults to latest 3.X anyhow
      libraries: 'geometry,visualization,places'
  });
  cfpLoadingBarProvider.latencyThreshold = 0;
  cfpLoadingBarProvider.startSize = 0;
  cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
  cfpLoadingBarProvider.includeSpinner = false;
}]).run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
  })
  $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
    if (toState.name == "login" && Meteor.user()) {
      $state.go('app.main');
    }
    // if (toState.url == "/verify" && Meteor.user()) {
    //   $state.go('app.main').then(function() {
    //     ToastService.showVerifyToast();
    //   });
    // }
  });
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // Catch error thrown when $meteor.requireUser() is rejected, redirect back to home page
    switch(error) {
      case "AUTH_REQUIRED":
        $state.go('login');
        break;
      // case "EMAIL_NOT_VALIDATED":
      //   $state.go('verify');
      //   break;
      default:
        $state.go('app.main');
    }
  });
}]);;

new Definer(App)
  .define(Login)
  .define(MapService)
  .define(MeteorMapService)
  .define(IntervalService)
  .define(SessionService)
  .define(MarkerIconService)
  .define(NavigationService)
  .define(DateFilter)
  .define(InputDirective)
  .define(ChatsCtrl)
  .define(ChatCtrl)
  .define(LoginCtrl)
  .define(MainCtrl)
  .define(MenuCtrl)
  .define(PlaylistCtrl)
  .define(MapCtrl)
  .define(GlobalCtrl)
  .define(RoutesConfig);

// Startup
if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
}
else {
  angular.element(document).ready(onReady);
}

function onReady() {
  angular.bootstrap(document, ['calert']);
}
