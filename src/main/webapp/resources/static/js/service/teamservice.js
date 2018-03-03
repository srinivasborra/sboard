'use strict';

app.factory('TeamService',['$http','$q',function($http,$q){
	var teammembers=[];
	return{
		createTeamMember	: createTeamMember,
		getTeamMember		: getTeamMember,
	};
	
	function createTeamMember(team){
		$http.post('http://localhost:8080/sboard/team/save',team)
		.success(function(team,status,headers){
			$scope.team=team;
		})
		.error(function(team,status,header){
			console.log("failure message:");
		});
	};
	function getTeamMember(){
		console.log("Service--getTeamMembers");
		var deferred=$q.defer();
		$http.get('http://localhost:8080/sboard/ui/team').then(function(response){
			teammembers=response.data;
			console.log("Response from teamservice getTeamMembers");
			deferred.resolve(teammembers);
		},function(error){
			console.log(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};
}]);
