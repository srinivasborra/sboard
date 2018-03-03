'use strict';
 
var app = angular.module('appScrumboard',['ngRoute','ngGrid','ui.bootstrap']);

app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
	//$locationProvider.html5Mode(true).hashPrefix('!');
	$routeProvider
	.when('/',{
			templateUrl:'resources/static/views/home.html',
			abstract: true,
			controller: 'mainController'
	})
	.when('/project',{
		templateUrl:'resources/static/views/project.html',
		abstract: true,
		controller:'projectController'
	})
	.when('/story',{
		templateUrl:'resources/static/views/story.html',
		abstract: true,
		controller:'storyController'
	})
	.when('/task',{
		templateUrl:'resources/static/views/task.html',
		abstract: true,
		transclude:true,
		controller:'taskController'
	})
	.when('/team',{
		templateUrl:'resources/static/views/team.html',
		abstract: true,
		controller:'teamController'
	})
	.when('/weather',{
		templateUrl:'resources/static/views/weather.html',
		abstract: true,
		//controller:'teamController'
	});
}]);

