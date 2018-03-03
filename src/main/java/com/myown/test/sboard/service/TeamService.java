package com.myown.test.sboard.service;

import java.util.List;

import com.myown.test.sboard.document.Team;

public interface TeamService {
	public void createTeamMember(Team team);
	public List<Team> getTeamMember();
	public void delteTeamMember();
}
