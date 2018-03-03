package com.myown.test.sboard.response;

public class TaskResponse {
	private String taskId;
	private String projectId;
	private String projectName;
	private String storyId;
	private String storyTitle;
	private String taskTitle;
	private String storyStatus;
	private String status;
	private String teamMemberEmployeeId;
	private String teamMemberName;
	private String createdDate;
	private String updateDate;
	private String storyDesc;
	
	public String getTaskId() {
		return taskId;
	}
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
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
	public String getTaskTitle() {
		return taskTitle;
	}
	public void setTaskTitle(String taskTitle) {
		this.taskTitle = taskTitle;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getTeamMemberEmployeeId() {
		return teamMemberEmployeeId;
	}
	public void setTeamMemberEmployeeId(String teamMemberEmployeeId) {
		this.teamMemberEmployeeId = teamMemberEmployeeId;
	}
	public String getTeamMemberName() {
		return teamMemberName;
	}
	public void setTeamMemberName(String teamMemberName) {
		this.teamMemberName = teamMemberName;
	}
	public String getStoryStatus() {
		return storyStatus;
	}
	public void setStoryStatus(String storyStatus) {
		this.storyStatus = storyStatus;
	}
	public String getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(String createdDate) {
		this.createdDate = createdDate;
	}
	public String getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(String updateDate) {
		this.updateDate = updateDate;
	}
	public String getStoryDesc() {
		return storyDesc;
	}
	public void setStoryDesc(String storyDesc) {
		this.storyDesc = storyDesc;
	}
	@Override
	public String toString() {
		return "TaskResponse [taskId=" + taskId + ", projectId=" + projectId + ", projectName=" + projectName
				+ ", storyId=" + storyId + ", storyTitle=" + storyTitle + ", taskTitle=" + taskTitle + ", storyStatus="
				+ storyStatus + ", status=" + status + ", teamMemberEmployeeId=" + teamMemberEmployeeId
				+ ", teamMemberName=" + teamMemberName + ", createdDate=" + createdDate + ", updateDate=" + updateDate
				+ "]";
	}
	
}
