'use strict';

angular.module('madden15App')
  .controller('PlayersCtrl', function ($scope, $http, socket) {
    $scope.players = [];

    $http.get('/api/players/top25').success(function(players) {
    	$scope.players = players;
    	socket.syncUpdates('players', $scope.players);
    });
  });
