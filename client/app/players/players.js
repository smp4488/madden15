'use strict';

angular.module('madden15App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('players', {
        url: '/players',
        templateUrl: 'app/players/players.html',
        controller: 'PlayersCtrl'
      });
  });