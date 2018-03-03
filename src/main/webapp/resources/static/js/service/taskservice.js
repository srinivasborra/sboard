'use strict';

app.factory('TaskService',['$http','$q',function($http,$q){
	var stories=[];
	var tasks=[];
	//var task=[];
	return{
		fetchStoriesByProjectId:fetchStoriesByProjectId,
		createTask		: createTask,
		getTasks		: getTasks,
		getTeamByProject: getTeamByProject,
		getTaskById		: getTaskById,
		deletetask		: deletetask,
	};
	
	function fetchStoriesByProjectId(projectId){
		var deferred = $q.defer();
		$http.get('http://localhost:8080/sboard/story/project?projectId='+projectId).then(function(response){
			stories=response.data;
			console.log(stories);
			deferred.resolve(stories);
		},function(error){
			console.log(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};
	
	
	function createTask(task){
		$http.post('http://localhost:8080/sboard/task/save',task)
		.success(function(status,headers){
			$scope.task=task;
		})
		.error(function(task,status,header){
			console.log("failure message:");
		});
	};
	
	function getTasks(){
		var deferred=$q.defer();
		$http.get('http://localhost:8080/sboard/ui/task').then(function(response){
			tasks=response.data;
			deferred.resolve(tasks);
		},function(error){
			console.log(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};
	function getTeamByProject(projectId){
		var deferred=$q.defer();
		$http.get('http://localhost:8080/sboard/project/team?projectId='+projectId).then(function(response){
			tasks=response.data;
			deferred.resolve(tasks);
		},function(error){
			console.log(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};
	function getTaskById(taskId){
		var deferred=$q.defer();
		$http.get('http://localhost:8080/sboard/task/task?taskId='+taskId).then(function(response){
			task=response.data;
			deferred.resolve(task);
		},function(error){
			console.log(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};
	
	function deletetask(taskId){
		$http.post('http://localhost:8080/sboard/task/delete',taskId)
		.success(function(status,headers){
			$scope.status=status;
			console.log("delete task Status:"+status);
		})
		.error(function(status,header){
			console.log("failure message:");
		});
	};
}]);