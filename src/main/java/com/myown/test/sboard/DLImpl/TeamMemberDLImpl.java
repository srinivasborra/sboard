package com.myown.test.sboard.DLImpl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.myown.test.sboard.document.Project;
import com.myown.test.sboard.document.TeamMember;
import com.myown.test.sboard.filter.StatusFilter;
import com.myown.test.sboard.response.TeamMemberResponse;
import com.myown.test.sboard.utils.SBoardUtil;

@Repository
public class TeamMemberDLImpl {
	@Autowired
	private MongoTemplate mongoTemplate;
	@Autowired
	private ProjectDLImpl projectDL;
	public static final String COLLECTION_NAME="teammember";
	
	public void createTeamMember(TeamMember teammember) {
		Date curDate = new Date();
		teammember.setUpdateDate(SBoardUtil.currentDate(curDate));
		if(teammember.getTeamMemberId()!=null){
			mongoTemplate.save(teammember);
		}else{
			teammember.setTeamMemberId(UUID.randomUUID().toString());
			teammember.setCreatedDate(SBoardUtil.currentDate(curDate));
			mongoTemplate.insert(teammember);
		}
	}

	public List<TeamMemberResponse> getTeamMember() {
		List<TeamMemberResponse> result=new ArrayList<TeamMemberResponse>();
		List<TeamMember> teams = new ArrayList<TeamMember>();
		
		teams=mongoTemplate.findAll(TeamMember.class,COLLECTION_NAME);
		List<Project> projects=projectDL.fetchProject();
		if(teams!=null && teams.size()>0){
			for(TeamMember tm : teams){
				TeamMemberResponse tmr=map2VO(tm);
				for(Project proj:projects){
					if(tm.getProjectId().equalsIgnoreCase(proj.getProjectId())){
						tmr.setProjectName(proj.getProjectName());
					}
				}
				result.add(tmr);
			}
		}
		return result;
	}

	public List<TeamMemberResponse> getTeamMemberByProject(StatusFilter filter) {
		List<TeamMemberResponse> result=new ArrayList<TeamMemberResponse>();
		List<TeamMember> teams = new ArrayList<TeamMember>();
		
		Query query=new Query(Criteria.where("status").is(filter.getMemberStatus()).andOperator(Criteria.where("projectId").is(filter.getProjectId())));
		teams=mongoTemplate.find(query,TeamMember.class,COLLECTION_NAME);
		List<Project> projects=projectDL.fetchProject();
		if(teams!=null && teams.size()>0){
			for(TeamMember tm : teams){
				TeamMemberResponse tmr=map2VO(tm);
				for(Project proj:projects){
					if(tm.getProjectId().equalsIgnoreCase(proj.getProjectId())){
						tmr.setProjectName(proj.getProjectName());
					}
				}
				result.add(tmr);
			}
		}
		return result;
	}
	
	
	public void delteTeamMember() {
		
	}
	private TeamMemberResponse map2VO(TeamMember teammember){
		TeamMemberResponse vo=new TeamMemberResponse();
		vo.setTeamMemberId(teammember.getTeamMemberId());
		vo.setProjectId(teammember.getProjectId());
		vo.setTeamMemberEmployeeId(teammember.getTeamMemberEmployeeId());
		vo.setTeamMemberName(teammember.getTeamMemberName());
		vo.setStatus(teammember.getStatus());
		vo.setCreatedDate(teammember.getCreatedDate());
		vo.setUpdateDate(teammember.getUpdateDate());
		return vo;
	}
}
