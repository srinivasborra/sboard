'use strict';

app.controller('projectController', ['$scope','$modal','ProjectService',function($scope,$modal,projectservice) {
	var statusText=[];
	projectservice.getProjects().then(function(data){
		$scope.projectData=data;
		angular.forEach($scope.projectData,function(row){
			statusText=row.status;
			switch(statusText){
			case "0":
					 row.statusText="Close";
					 break;
			case "1":
					row.statusText="Open";
					break;
			}
			return statusText;
		});
	});
	$scope.mySelections = [];
	$scope.gridOptions={
			data: 'projectData',
			showGroupPanel: false,
	        columnDefs: [{field:'projectId', displayName:'Project Id',visible:false}, 
	                     {field:'projectName', displayName:'Project Name',width:'50%'},
	                     {field:'statusText', displayName:'Status',width:'20%'},
	                     {field:'createdOn', displayName:'Create Date',width:'15%'},
	                     {field:'updatedOn', displayName:'Udpate Date',width:'15%'}],
	        multiSelect: false,
	        showSelectionCheckbox: false,
	        selectedItems:$scope.mySelections,
	        enableHorizontalScrollbar:0,
	        enablePaging: true
	};
	$scope.$on('ngGridEventData', function(){
       var selectedRow= $scope.gridOptions.selectRow(0, true);
    });
	$scope.create_edit=function(){
		$modal.open({
			templateUrl:'resources/static/views/create_edit.html',
			controller:'projectController',
			
		});
	};
	$scope.saveProject=function(project){
		projectservice.createEdit(project);
		$scope.closeProjectForm();
	};
	$scope.closeProjectForm=function(){
		$('#myModal').hide(true);
		location.reload();
	};
	$scope.editRow=function(){
		$scope.project=$scope.gridOptions.selectedItems[0];
		$modal.open({
			scope:$scope,
			templateUrl:'resources/static/views/create_edit.html',
			controller:'projectController',
		});
	};
	$scope.deleteRow=function(){
		$scope.project=$scope.gridOptions.selectedItems[0];
		projectservice.deleteProject($scope.project);
		location.reload();
	}
}]);