'use strict';

app.controller('taskController',['$scope','$modal','TaskService','StoryService','ProjectService','TeamService',function($scope,$modal,taskservice,storyservice,projectservice,teamservice){
	$scope.myRowSelection = [];
	var statusText=[];
		taskservice.getTasks().then(function(data){
			$scope.tasks=data;
			
			angular.forEach($scope.tasks,function(row){
				statusText=row.status;
				switch(statusText){
					case "0":
							 row.statusText="Blocker";
							 break;
					case "1":
							row.statusText="To Do";
							break;
					case "2":
							row.statusText="Work in Progress";
							break;
					case "3":
							row.statusText="Done";
							break;
					}  
					return row.statusText;
				});
		});
	$scope.taskgrid={
			data:'tasks',
			columnDefs:[{field:'taskId',displayName:'Task Id',visible:false},
			            {field:'projectName',displayName:'Project',width:'15%'},
			            {field:'storyTitle',displayName:'Story',width:'20%'},
			            {field:'taskTitle',displayName:'Task Title',width:'20%'},
			            {field:'statusText',displayName:'Status',width:'10%'},
			            {field:'teamMemberName',displayName:'Assigned To',width:'15%'},
			            {field:'createdDate',displayName:'Create Date',width:'10%'},
			            {field:'updateDate',displayName:'Update Date',width:'10%'}],
			multiSelect:false,
	        selectedItems:$scope.myRowSelection,
	        angularCompileRows: true
		};
	projectservice.getProjects().then(function(data){
		$scope.projects=data;
	});
	
	$scope.create_edit=function(){
		$modal.open({
			templateUrl:'resources/static/views/createedit_task.html',
			controller:'taskController'
		});
	};
	$scope.editRow=function(){
		$scope.task=$scope.taskgrid.selectedItems[0];
		$modal.open({
			scope:$scope,
			templateUrl:'resources/static/views/createedit_task.html',
			controller:'taskController',
		});
		
	};
	$scope.closeTaskForm=function(){
		$('#modaltask').hide(true);
		location.reload();
	};
	
	$scope.getStoriesByProject=function(projectId){
//		console.log(projectId)
//		taskservice.fetchStoriesByProjectId(projectId).then(function(data){
//			$scope.stories=data;
//		});
		taskservice.getTeamByProject(projectId).then(function(data){
			$scope.teammembers=data;
			
		});
		
	};

	$scope.getStoryDescById=function(story){
		$scope.task.storyDesc="";
		angular.forEach($scope.stories,function(key,value){
			if($scope.stories[value].storyId==story){
				$scope.task.storyDesc=$scope.stories[value].storyDescription;
				console.log($scope.task.storyDesc);
			}
		});
		
	};
	
	$scope.saveTask=function(task){
		taskservice.createTask(task);
		$scope.closeTaskForm();
	};
	$scope.removeTask=function(){
		$scope.task=$scope.taskgrid.selectedItems[0];
		taskservice.deletetask($scope.task);
		location.reload();
	};
	
	$scope.showStoryDetails=function(projectId){
		$scope.stories=[];
		if(projectId!=undefined){
			taskservice.fetchStoriesByProjectId(projectId).then(function(data){
				$scope.stories=data;
			});
			taskservice.getTeamByProject(projectId).then(function(data){
				$scope.teammembers=data;
			});
		
		}
	}
	
}]);

