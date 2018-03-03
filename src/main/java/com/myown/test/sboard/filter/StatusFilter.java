package com.myown.test.sboard.filter;

public class StatusFilter {
	private String memberStatus;
	private String projectStatus;
	private String projectId;
	
	public String getMemberStatus() {
		return memberStatus;
	}
	public void setMemberStatus(String memberStatus) {
		this.memberStatus = memberStatus;
	}
	public String getProjectStatus() {
		return projectStatus;
	}
	public void setProjectStatus(String projectStatus) {
		this.projectStatus = projectStatus;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	
	@Override
	public String toString() {
		return "StatusFilter [memberStatus=" + memberStatus + ", projectStatus=" + projectStatus + ", projectId="
				+ projectId + "]";
	}
	
	
}
