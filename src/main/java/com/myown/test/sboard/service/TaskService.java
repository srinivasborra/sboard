package com.myown.test.sboard.service;

import java.util.List;

import com.myown.test.sboard.document.Task;
import com.myown.test.sboard.response.TaskResponse;

public interface TaskService {
	public void createTask(Task task);
	public List<TaskResponse> getTask();
	public void deleteTask(Task task);
	public TaskResponse fetchTask(String taskId);
}
