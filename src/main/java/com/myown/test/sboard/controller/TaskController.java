package com.myown.test.sboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.view.RedirectView;

import com.myown.test.sboard.document.Task;
import com.myown.test.sboard.response.TaskResponse;
import com.myown.test.sboard.service.TaskService;

@Controller
public class TaskController {
	@Autowired
	public TaskService service;
	
	@RequestMapping(value="task/save", method=RequestMethod.POST)
	public View createTask(@RequestBody Task task){
		service.createTask(task);
		return new RedirectView("/task");
	}
	
	@RequestMapping(value="ui/task",method=RequestMethod.GET,produces="application/json")
	public @ResponseBody List<TaskResponse> getTask(){
		List<TaskResponse> tasks=service.getTask();
		return tasks;
	}
	@RequestMapping(value="task/task",method=RequestMethod.GET,produces="application/json")
	public @ResponseBody TaskResponse fetchTask(@RequestParam String taskId){
		TaskResponse task=service.fetchTask(taskId);
		return task;
	}
	@RequestMapping(value="task/delete",method=RequestMethod.POST)
	public void deleteTask(@RequestBody Task task){
		service.deleteTask(task);
	}
}
