'use strict';

app.factory('ProjectService',['$http','$q',function($http,$q){
	var projects=[];
	return {
		getProjects: getProjects,
		createEdit:createEdit,
		deleteProject:deleteProject
	 };
	 
	function getProjects(){
		var deferred = $q.defer();
		$http.get('http://localhost:8080/sboard/ui/project').then(function(response){
			projects=response.data;
			deferred.resolve(projects);
		},function(error){
			console.log(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};
	 
	 function createEdit(project){
		$http.post('http://localhost:8080/sboard/project/save',project)
		.success(function(project,status,headers){
			$scope.project=project;
		})
		.error(function(project,status,header){
			console.log("failure message:");
		});
	};
	function deleteProject(project){
		console.log("delete a project called");
		$http.post('http://localhost:8080/sboard/project/delete',project)
		.success(function(project,status,headers){
			$scope.project=project;
		})
		.error(function(project,status,header){
			console.log("failure message:");
		});
	};
	
}]);
	