package com.myown.test.sboard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.myown.test.sboard.DLImpl.TeamMemberDLImpl;
import com.myown.test.sboard.document.TeamMember;
import com.myown.test.sboard.filter.StatusFilter;
import com.myown.test.sboard.response.TeamMemberResponse;

@Repository
public class TeamMemberServiceImpl implements TeamMemberService {
	@Autowired
	private TeamMemberDLImpl teamMemberDL;

	@Override
	public void createTeamMember(TeamMember teammember) {
		teamMemberDL.createTeamMember(teammember);
	}

	@Override
	public List<TeamMemberResponse> getTeamMember() {
		return teamMemberDL.getTeamMember();
	}

	@Override
	public void delteTeamMember() {
		
	}

	@Override
	public List<TeamMemberResponse> getTeamMemberByProject(StatusFilter filter) {
		return teamMemberDL.getTeamMemberByProject(filter);
	}
	
//	private MongoTemplate mongoTemplate;
//	@Autowired
//	private ProjectService projectService;
//	public static final String COLLECTION_NAME="teammember";
//	
//	@Override
//	public void createTeamMember(TeamMember teammember) {
//		Date curDate = new Date();
//		teammember.setUpdateDate(SBoardUtil.currentDate(curDate));
//		if(teammember.getTeamMemberId()!=null){
//			mongoTemplate.save(teammember);
//		}else{
//			teammember.setTeamMemberId(UUID.randomUUID().toString());
//			teammember.setCreatedDate(SBoardUtil.currentDate(curDate));
//			mongoTemplate.insert(teammember);
//		}
//	}
//
//	@Override
//	public List<TeamMemberResponse> getTeamMember() {
//		String filter=null;
//		List<TeamMemberResponse> result=new ArrayList<TeamMemberResponse>();
//		List<TeamMember> teams = new ArrayList<TeamMember>();
//		
//		if(filter!=null && filter.equalsIgnoreCase("active")){
//			Query query=new Query(Criteria.where("status").is("1"));
//			teams=mongoTemplate.find(query, TeamMember.class, COLLECTION_NAME);
//		}else{
//			teams=mongoTemplate.findAll(TeamMember.class,COLLECTION_NAME);
//		}
//		
//		List<Project> projects=projectService.fetchProject();
//		if(teams!=null && teams.size()>0){
//			for(TeamMember tm : teams){
//				TeamMemberResponse tmr=map2VO(tm);
//				for(Project proj:projects){
//					if(tm.getProjectId().equalsIgnoreCase(proj.getProjectId())){
//						tmr.setProjectName(proj.getProjectName());
//					}
//				}
//				result.add(tmr);
//			}
//		}
//		return result;
//	}
//
//	@Override
//	public void delteTeamMember() {
//		// TODO Auto-generated method stub
//		
//	}
//	private TeamMemberResponse map2VO(TeamMember teammember){
//		TeamMemberResponse vo=new TeamMemberResponse();
//		vo.setTeamMemberId(teammember.getTeamMemberId());
//		vo.setProjectId(teammember.getProjectId());
//		vo.setTeamMemberEmployeeId(teammember.getTeamMemberEmployeeId());
//		vo.setTeamMemberName(teammember.getTeamMemberName());
//		vo.setStatus(teammember.getStatus());
//		vo.setCreatedDate(teammember.getCreatedDate());
//		vo.setUpdateDate(teammember.getUpdateDate());
//		return vo;
//	}
}
