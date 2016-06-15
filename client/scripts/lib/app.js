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
import Definer from '../definer';
import RoutesConfig from '../routes';
import MenuCtrl from '../controllers/menu.controller';
import PlaylistCtrl from '../controllers/playlist.controller';
import MapCtrl from '../controllers/map.controller';
import LoginCtrl from '../controllers/login.controller';
import ChatsCtrl from '../controllers/chats.controller';
import Login from '../services/login.service';
import MeteorMapService from '../services/map.service'
import IntervalService from '../services/interval.service'
import DateFilter from '../filters/date.filter';
import ChatCtrl from '../controllers/chat.controller';
import InputDirective from '../directives/input.directive';

// Modules

// App
const App = angular.module('calert', [
  'angular-meteor',
  'angularMoment',
  'accounts.ui',
  'ionic',
  'nemLogging',
  'uiGmapgoogle-maps'
]).config(['uiGmapGoogleMapApiProvider',function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyCS91b3IpVVqYikQ69nNdoz_Za9S98qt8A',
      v: '3.24', //defaults to latest 3.X anyhow
      libraries: 'geometry,visualization,places'
  });
}]);

new Definer(App)
  .define(Login)
  .define(MeteorMapService)
  .define(IntervalService)
  .define(DateFilter)
  .define(InputDirective)
  .define(ChatsCtrl)
  .define(ChatCtrl)
  .define(LoginCtrl)
  .define(MenuCtrl)
  .define(PlaylistCtrl)
  .define(MapCtrl)
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
