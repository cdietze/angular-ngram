'use strict';

function NgramController($scope) {
	$scope.inputWords = ["Pac-Man", "Tetris: The Soviet Mind Game", "Mario Bros.", "Donkey Kong", "Dig Dug", "Super Mario Kart", "Galaga",
	"The Legend of Zelda: Ocarina of Time", "Doom", "Space Invaders", "Paperboy", "Mortal Kombat", "Street Fighter", "Super Mario Bros.", "Contra",
	"Gauntlet", "Frogger", "Defender", "Pole Position", "Double Dragon", "NBA Jam", "Super Smash Bros.", "Pokemon Red and Blue", "Resident Evil",
	"Ultima VII", "Zaxxon", "Gorf"];
	$scope.wordToAdd = "";

	$scope.addWord = function() {
		if($scope.wordToAdd === "") return;
		if($.inArray($scope.wordToAdd, $scope.inputWords) != -1) return;
		$scope.inputWords.push($scope.wordToAdd);
		$scope.wordToAdd = "";
		$scope.updateOutput();
	}

	$scope.removeWord = function(word) {
		var index = $.inArray(word, $scope.inputWords);
		$scope.inputWords.splice(index, 1);
		$scope.updateOutput();
	}

	$scope.updateOutput = function() {
		var dict = new NGramDict();
		$.map($scope.inputWords, function(word) {
			dict.learn(word);
		});
		$scope.outputWords = [];
		for(var i=0;i<50;i++)
			$scope.outputWords.push(dict.generate());
	}

	$scope.updateOutput();
}


function NGramDict() {
	var tokenMap = {}; // "Hal" -> 1, ...
	var nGramLength = 2;

	this.learn = function(word) {
		var tokens = tokenize("^" + word + "$", nGramLength + 1);
		$.map(tokens, function(token) {
			if(tokenMap[token] === undefined) tokenMap[token] = 1; else tokenMap[token] += 1;
		});
	}

	this.generate = function() {
		var str = pickStartElement();
		while(true) {
			var next = pickNextElement(str);
			if(next.length == 0) return str;
			str += next;
			if(str.length >= 100) return str;
		}
	}

	function pickStartElement() {
		var candidates = {};
		for(var k in tokenMap) {
			if(k.charAt(0) == "^") candidates[k] = tokenMap[k];
		}
		return pickRandomElement(candidates).substr(1);
	}

	function pickNextElement(str) {
		var prefix = str.substr(str.length-nGramLength, nGramLength);
		var candidates = {};
		for(var k in tokenMap) {
			if(k.substr(0, prefix.length) == prefix) candidates[k] = tokenMap[k];
		}
		var next = pickRandomElement(candidates).substr(prefix.length);
		if(next == "$") return "";
		return next;
	}

	function pickRandomElement(map) {
		var count = sumOfValues(map);
		if(count == 0) return "";
		var pick = Math.floor(Math.random() * count);
		for(var k in map) {
			pick -= map[k];
			if(pick < 0) return k;
		}
		console.assert(false, "couldnt find an element in " + map, "count: "+count, "pick: "+pick);
	}

	function tokenize(word, tokenLength) {
		var result = [];
		for(var i=0; i<=word.length-tokenLength; i++) {
			result.push(word.substr(i,tokenLength));
		}
		return result;
	}

	function sumOfValues(map) {
		var result = 0;
		for(var k in map) result += map[k];
		return result;
	}
}
