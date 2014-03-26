var app = angular.module('bnw-replies', []);

app.filter('lines', function () {
	return function (text) {
		return text.replace(/\n+/g, '\n').replace(/(^\n|\n$)/g, '').split('\n');
	};
});

app.controller('Replies', function ($scope, $http) {
	$scope.replies = [];
	
	var initWS = function () {
		var ws = new WebSocket('wss://bnw.im/comments/ws');
		ws.onmessage = function (event) {
			$scope.$apply(function () {
				$scope.replies = [JSON.parse(event.data)].concat($scope.replies);
			});
		};
		ws.onclose = initWS;
	};
	initWS();

	$scope.load = function () {
		$http.get('/comments?skip='+$scope.replies.length)
		.success(function (replies) {
			if (!replies.length) return ($scope.finish = true);
			$scope.replies = $scope.replies.concat(replies);
		});
	};
	$scope.load();
});
