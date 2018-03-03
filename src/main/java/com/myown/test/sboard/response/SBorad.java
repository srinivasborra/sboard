package com.myown.test.sboard.response;

import java.util.List;

import com.myown.test.sboard.document.Task;

public class SBorad {
	
	private String storyId;
	private String storyTitle;
	List<Task> task;
	public String getStoryId() {
		return storyId;
	}
	public void setStoryId(String storyId) {
		this.storyId = storyId;
	}
	public String getStoryTitle() {
		return storyTitle;
	}
	public void setStoryTitle(String storyTitle) {
		this.storyTitle = storyTitle;
	}
	public List<Task> getTask() {
		return task;
	}
	public void setTask(List<Task> task) {
		this.task = task;
	}
	@Override
	public String toString() {
		return "SBorad [storyId=" + storyId + ", storyTitle=" + storyTitle + ", task=" + task + "]";
	}
}
