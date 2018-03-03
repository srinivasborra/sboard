'use strict';

app.controller('mainController',['$scope','$http','$modal','TaskService', function($scope,$http,$modal,taskservice) {
	  var storyHtml=angular.element($('#story'));
	  var blockerHtml=angular.element($('#blocker'));
	  var todoHtml=angular.element($('#todo'));
	  var wipHtml=angular.element($('#wip'));
	  var doneHtml=angular.element($('#done'));
	  $scope.task=[];
	  taskservice.getTasks().then(function(data){
			$scope.tasks=data;
			var storyArray=[];
			var curDate=new Date();
			var curDateFormatted=curDate.getMonth()+1+"/"+curDate.getDate()+"/"+curDate.getFullYear();
			
//			angular.forEach($scope.tasks,function(value,index){
//				storyArray.push(value.storyId);
//			});
//			
//			angular.forEach(unique(storyArray),function(id,index){
//				storyHtml.append("<div style='height:150px;width:200px;border:1px solid red;' id='"+id+"'></div>");
//			});
			
			angular.forEach($scope.tasks,function(value,index){
				var currentStatus=value.status;
				if(value.storyStatus==="1"){
					storyHtml.append("<h6>"+value.storyTitle+"</h6>");
					switch(currentStatus){
					case "0":
						blockerHtml.append("<table border='1' bgcolor='#8B898E'><tr style='height:200px;'><td colspan='2' style='width:250px;' valign='top' class='zoom'>"+value.taskTitle+"</td></tr>");
						if(value.teamMemberName!=null){
							blockerHtml.append("<tr style='height:50px;'><td style='width:200px;' valign='top'>"+value.teamMemberName+"</td><td style='width:50px;'><button id='toDoEdit' value='"+value.taskId+"'>Edit</button></td></tr>");
						}else{
							blockerHtml.append("<tr style='height:50px;'><td style='width:200px;' valign='top'></td><td style='width:50px;'><button id='toDoEdit' value='"+value.taskId+"'>Edit</button></td></tr>");
						}
						blockerHtml.append("</table>");
//						blockerHtml.append("<div style='height:200px; width:150px;border:1px solid black;' class='zoom'>"+value.taskTitle+"</br>");
//						if(value.teamMemberName!=null){
//							blockerHtml.append("<div>Assigned To:"+value.teamMemberName+"</div>");
//						}
//						blockerHtml.append("<button id='blocker' value='"+value.taskId+"'>Edit</button>");
//						blockerHtml.append("</div>");
						break;
					case "1":
						todoHtml.append("<table border='0' bgcolor='#D2D7CC'><tr style='height:200px;'><td colspan='2' style='width:250px;' valign='top' class='zoom'>"+value.taskTitle+"</td></tr>");
						if(value.teamMemberName!=null){
							todoHtml.append("<tr style='height:50px;'><td style='width:200px;' valign='top'>"+value.teamMemberName+"</td><td style='width:50px;'><button id='toDoEdit' value='"+value.taskId+"'>Edit</button></td></tr>");
						}else{
							todoHtml.append("<tr style='height:50px;'><td style='width:200px;' valign='top'></td><td style='width:50px;'><button id='toDoEdit' value='"+value.taskId+"'>Edit</button></td></tr>");
						}
						todoHtml.append("</table>");
						break;
					case "2":
						wipHtml.append("<table border='0' bgcolor='#AFED68'><tr style='height:200px;'><td colspan='2' style='width:250px;' valign='top' class='zoom'>"+value.taskTitle+"</td></tr>");
						if(value.teamMemberName!=null){
							wipHtml.append("<tr style='height:50px;'><td style='width:200px;' valign='top'>"+value.teamMemberName+"</td><td style='width:50px;'><button id='toDoEdit' value='"+value.taskId+"'>Edit</button></td></tr>");
						}else{
							wipHtml.append("<tr style='height:50px;'><td style='width:200px;' valign='top'></td><td style='width:50px;'><button id='toDoEdit' value='"+value.taskId+"'>Edit</button></td></tr>");
						}
						wipHtml.append("</table>");
						 break;
					case "3":
						if(dateDiff(curDateFormatted,value.updateDate)<1){
							doneHtml.append("<table border='0' bgcolor='#AAED68'><tr style='height:200px;'><td colspan='2' style='width:250px;' valign='top' class='zoom'>"+value.taskTitle+"</td></tr>");
							if(value.teamMemberName!=null){
								doneHtml.append("<tr style='height:50px;'><td style='width:200px;' valign='top'>"+value.teamMemberName+"</td><td style='width:50px;'><button id='toDoEdit' value='"+value.taskId+"'>Edit</button></td></tr>");
							}else{
								doneHtml.append("<tr style='height:50px;'><td style='width:200px;' valign='top'></td><td style='width:50px;'><button id='toDoEdit' value='"+value.taskId+"'>Edit</button></td></tr>");
							}
							doneHtml.append("</table>");
							
//							doneHtml.append("<div style='height:200px;width:150px;border:1px solid black;' class='zoom'>"+value.taskTitle+"</br>");
//							if(value.teamMemberName!=null){
//								doneHtml.append("<div style='size:auto;position:relative;'>Assigned To:"+value.teamMemberName+"</div>");
//							}
//							doneHtml.append("<button id='done' value='"+value.taskId+"'>Edit</button>");
//							doneHtml.append("</div>");
						}
						break;
					}
				}
				 
			 });
			function dateDiff(currentDate,incomingDate){
				var diffDays=(new Date(currentDate).getTime()-new Date(incomingDate).getTime())/(24*60*60*1000);
				return diffDays;
			}
			function unique(list) {
			    var result = [];
			    $.each(list, function(i, e) {
			        if ($.inArray(e, result) == -1) result.push(e);
			    });
			    return result;
			}
		  $('button').on('click',function(event){
			  $http.get('http://localhost:8080/sboard/task/task?taskId='+event.target.value).then(function(response){
					$scope.task=response.data;
					console.log($scope.task);
					$modal.open({
					  	scope:$scope,
						templateUrl:'resources/static/views/createedit_task.html',
						controller:'taskController'
					});
			  });
		  });
	  });
	 
}]);