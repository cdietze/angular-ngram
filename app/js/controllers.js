'use strict';

/* Controllers */
/*
angular.module('myApp.controllers', []).
  controller('ngramController', [function($scope) {
  	$scope.inputWords = ["Hallo", "Nexus", "Katharina", "Linux", "Scala"];

  }])
  .controller('MyCtrl2', [function() {

  }]);

  */

function NgramController($scope) {
	$scope.inputWords = ["Hallo", "Nexus", "Katharina", "Linux", "Scala", "Hallo2", "Nexus2", "Katharina2", "Linux2", "Scala2"];
	$scope.outputWords = $scope.inputWords
	$scope.wordToAdd = "";

	$scope.addWord = function() {
		if($scope.wordToAdd === "") return;
		if($.inArray($scope.wordToAdd, $scope.inputWords) != -1) return;
		$scope.inputWords.push($scope.wordToAdd);
		$scope.wordToAdd = "";
	}

	$scope.removeWord = function(word) {
		console.info("removing: "+word);
		var index = $.inArray(word, $scope.inputWords);
		$scope.inputWords.splice(index, 1);
	}

}
