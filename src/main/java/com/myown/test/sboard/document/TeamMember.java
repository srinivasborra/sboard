package com.myown.test.sboard.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="teammember")
public class TeamMember {
	
	@Id
	private String teamMemberId;
	private String projectId;
	private String teamMemberEmployeeId;
	private String teamMemberName;
	private String status;
	private String createdDate;
	private String updateDate;
	public String getTeamMemberId() {
		return teamMemberId;
	}
	public void setTeamMemberId(String teamMemberId) {
		this.teamMemberId = teamMemberId;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
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
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
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
	
	@Override
	public String toString() {
		return "TeamMember [teamMemberId=" + teamMemberId + ", projectId=" + projectId + ", teamMemberEmployeeId="
				+ teamMemberEmployeeId + ", teamMemberName=" + teamMemberName + ", status=" + status + ", createdDate="
				+ createdDate + ", updateDate=" + updateDate + "]";
	}
	
}
