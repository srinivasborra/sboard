'use strict';
app.controller('storyController',['$scope','$modal','ProjectService','StoryService',function($scope,$modal,projectservice,storyservice){
	$scope.myRowSelection = [];
	var statusText=[];
	projectservice.getProjects().then(function(data){
		$scope.projects=data;
		storyservice.fetchStories().then(function(data){
			$scope.stories=data;
			angular.forEach($scope.stories,function(key,value){
				angular.forEach($scope.projects,function(key1,value1){
					if($scope.stories[value].projectId==$scope.projects[value1].projectId){
						$scope.stories[value].projectName=$scope.projects[value1].projectName;
					}
				});
			});
			angular.forEach($scope.stories,function(row){
				statusText=row.status;
				switch(statusText){
				case "0":
						 row.statusText="Closed";
						 break;
				case "1":
						row.statusText="Open";
						break;
				}
				return statusText;
			});
		});
		
	});
	
	$scope.storygrid={
			data:'stories',
			columnDefs: [{field:'storyId', displayName:'Story Id',visible:false},
			             {field:'projectName', displayName:'Project Name',visible:true,width:'20%'},
	                     {field:'storyTitle', displayName:'Story Title',width:'20%'},
	                     {field:'storyDescription', displayName:'Description',width:'30%'},
	                     {field:'statusText', displayName:'Status',width:'10%'},
	                     {field:'createdOn', displayName:'Created On',width:'10%'},
	                     {field:'updatedOn', displayName:'Updated On',width:'10%'},
	                     {field:'projectId', displayName:'Project Id',visible:false}],
	         multiSelect:false,
	         selectedItems:$scope.myRowSelection,
	};
	$scope.create_edit=function(){
		$modal.open({
			templateUrl:'resources/static/views/createedit_story.html',
			controller:'storyController',
		});
	};
	
	$scope.saveStory=function(story){
		storyservice.createStory(story);
		$scope.$watch('projectName',function(){
			console.log("Watch");
			console.log($scope.projectName);
			storyservice.story = $scope.story;
		});
		$scope.closeStoryForm();
	};
	
	$scope.closeStoryForm=function(){
			$('#modalstory').hide(true);
			location.reload();
	};

	$scope.editRow=function(){
		$scope.story=$scope.myRowSelection[0];
		$modal.open({
			scope:$scope,
			templateUrl:'resources/static/views/createedit_story.html',
			controller:'storyController',
		});
	};
	
	$scope.deletestory=function(){
		$scope.story=$scope.myRowSelection[0];
		storyservice.deleteStory($scope.story);
		location.reload();
	};
	
	
}]);