'use strict';

app.factory('StoryService',['$http','$q',function($http,$q){
	var stories=[];
	return{
		fetchStories: fetchStories,
		createStory : createStory,
		deleteStory : deleteStory,
	};
	
	function fetchStories(){
		var deferred = $q.defer();
		$http.get('http://localhost:8080/sboard/ui/story').then(function(response){
			stories=response.data;
			console.log("Stories----");
			console.log(stories);
			deferred.resolve(stories);
		},function(error){
			console.log(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};
	
	function createStory(story){
		$http.post('http://localhost:8080/sboard/story/save',story)
		.success(function(story,status,headers){
			$scope.story=story;
		})
		.error(function(story,status,header){
			console.log("failure message:");
		});
	};
	
	function deleteStory(story){
		$http.post('http://localhost:8080/sboard/story/delete',story)
		.success(function(story,status,headers){
			//$scope.status=status;
		})
		.error(function(story,status,header){
			console.log("failure message:");
		});
	};
	
	
}]);
