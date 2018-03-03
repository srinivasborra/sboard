package com.myown.test.sboard.service;

import java.util.List;

import com.myown.test.sboard.document.TeamMember;
import com.myown.test.sboard.filter.StatusFilter;
import com.myown.test.sboard.response.TeamMemberResponse;

public interface TeamMemberService {
	public void createTeamMember(TeamMember teammember);
	public List<TeamMemberResponse> getTeamMember();
	public void delteTeamMember();
	public List<TeamMemberResponse> getTeamMemberByProject(StatusFilter filter);
}
