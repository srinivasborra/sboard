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

import com.myown.test.sboard.document.TeamMember;
import com.myown.test.sboard.filter.StatusFilter;
import com.myown.test.sboard.response.TeamMemberResponse;
import com.myown.test.sboard.service.TeamMemberService;

@Controller
public class TeamMemberController {
	@Autowired
	private TeamMemberService service;
	
	@RequestMapping(value="team/save",method=RequestMethod.POST)
	public View createUpdateTeamMember(@RequestBody TeamMember teammember){
		service.createTeamMember(teammember);
		return new RedirectView("/team");
	}
	
	@RequestMapping(value="ui/team",method=RequestMethod.GET,produces="application/json")
	public @ResponseBody List<TeamMemberResponse> getTeamMember(){
		List<TeamMemberResponse> result= service.getTeamMember();
		return result;
	}
	
	@RequestMapping(value="project/team",method=RequestMethod.GET,produces="application/json")
	public @ResponseBody List<TeamMemberResponse> getTeamMemberByProject(@RequestParam String projectId){
		StatusFilter stf=new StatusFilter();
		stf.setMemberStatus("1");
		stf.setProjectId(projectId);
		List<TeamMemberResponse> result= service.getTeamMemberByProject(stf);
		return result;
	}
} 
