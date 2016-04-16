// Libs
import angular from 'angular';
import 'angular-animate';
import 'angular-meteor';
import 'angular-moment';
import 'angular-sanitize';
import 'angular-ui-router';
import 'ionic-scripts';
import Definer from '../definer';
import RoutesConfig from '../routes';
import MenuCtrl from '../controllers/menu.controller';
import PlaylistCtrl from '../controllers/playlist.controller';
import PlaylistsCtrl from '../controllers/playlists.controller';
import ChatsCtrl from '../controllers/chats.controller';
import Login from '../services/login.service';
import DateFilter from '../filters/date.filter';
import ChatCtrl from '../controllers/chat.controller';
import InputDirective from '../directives/input.directive';

// Modules

// App
const App = angular.module('starter', [
  'angular-meteor',
  'angularMoment',
  'ionic'
]);

new Definer(App)
  .define(Login)
  .define(DateFilter)
  .define(InputDirective)
  .define(ChatsCtrl)
  .define(ChatCtrl)
  .define(MenuCtrl)
  .define(PlaylistCtrl)
  .define(PlaylistsCtrl)
  .define(RoutesConfig);

// Startup
if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
}
else {
  angular.element(document).ready(onReady);
}

function onReady() {
  angular.bootstrap(document, ['starter']);
}
