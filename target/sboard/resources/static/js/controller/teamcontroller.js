'use strict';

app.controller('teamController',['$scope','$modal','ProjectService','TeamService',function($scope,$modal,projectservice,teamservice){
	
	$scope.myRowSelection=[];
	var statusText=[];
	projectservice.getProjects().then(function(data){
		$scope.projects=data;
	});
	
	teamservice.getTeamMember().then(function(data){
		$scope.team_data=data;
		console.log($scope.team_data);
		angular.forEach($scope.team_data,function(row){
			statusText=row.status;
			switch(statusText){
			case "0":
					 row.statusText="Inactive";
					 break;
			case "1":
					row.statusText="Active";
					break;
			}
			return statusText;
		});
	});
	
	$scope.teamgrid={
			data:'team_data',
			columnDefs:[{field:'teamMemberId',displayName:'Team Member Id',visible:false},
			            {field:'projectName',displayName:'Project',width:'25%'},
			            {field:'teamMemberEmployeeId',displayName:'Employee Id',width:'20%'},
			            {field:'teamMemberName',displayName:'Employee Name',width:'25%'},
			            {field:'statusText',displayName:'Status',width:'10%'},
			            {field:'createdDate',displayName:'Created On',width:'10%'},
			            {field:'updateDate',displayName:'Updated On',width:'10%'}],
			multiSelect:false,
	        selectedItems:$scope.myRowSelection,
	        angularCompileRows: true
		};
	
	$scope.create_edit=function(){
		$modal.open({
			templateUrl:'resources/static/views/createedit_team.html',
			controller:'teamController'
		});
	};
	
	$scope.saveTeam=function(team){
		teamservice.createTeamMember(team);
		$scope.closeTeamForm();
	};
	
	$scope.editRow=function(){
		$scope.team=$scope.myRowSelection[0];
		$modal.open({
			scope:$scope,
			templateUrl:'resources/static/views/createedit_team.html',
			controller:'teamController',
		});
	};
	
	$scope.closeTeamForm=function(){
		$('#modalteam').hide(true);
		location.reload();
	};
}]);