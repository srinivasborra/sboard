app.controller('ContactController',function($scope,ContactService){
	$scope.contacts=ContactService.list();
	$scope.saveContact=function(){
		ContactService.save($scope.newcontact);
		$scope.newcontact={};
	}
	
	$scope.editContact = function (id) {
        $scope.newcontact = angular.copy(ContactService.get(id));
    }
	
	$scope.deleteContact=function(id){
		ContactService.deleteContact(id);
	}
});