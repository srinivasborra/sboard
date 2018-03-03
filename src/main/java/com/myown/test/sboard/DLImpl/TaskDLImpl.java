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
import com.myown.test.sboard.document.Story;
import com.myown.test.sboard.document.Task;
import com.myown.test.sboard.response.TaskResponse;
import com.myown.test.sboard.response.TeamMemberResponse;
import com.myown.test.sboard.service.TeamMemberService;
import com.myown.test.sboard.utils.SBoardUtil;

@Repository
public class TaskDLImpl {
	@Autowired
	private MongoTemplate mongoTemplate;
	@Autowired
	private ProjectDLImpl projectDL;
	@Autowired
	private StoryDLImpl storyDL;
	@Autowired
	private TeamMemberService teamService;
	
	public static final String COLLECTION_NAME="task";
	
	public void createTask(Task task) {
		Date curDate = new Date();
		
		if(task.getTaskId()!=null){
			task.setUpdateDate(SBoardUtil.currentDate(curDate));
			mongoTemplate.save(task);
		}else{
			task.setTaskId(UUID.randomUUID().toString());
			task.setCreatedDate(SBoardUtil.currentDate(curDate));
			mongoTemplate.insert(task);
		}
	}

	public List<TaskResponse> getTask() {
		List<Task> tasks=mongoTemplate.findAll(Task.class,COLLECTION_NAME);
		List<TaskResponse> taskRes=new ArrayList<TaskResponse>();
		List<Project> projects=projectDL.fetchProject();
		List<Story> stories=storyDL.fetchStory();
		List<TeamMemberResponse> teamMembers=teamService.getTeamMember();
		if(tasks!=null && tasks.size()>0){
			for(Task task:tasks){
				TaskResponse tr=map2VO(task);
				for(Project proj:projects){
					if(task.getProjectId()!=null && task.getProjectId().equalsIgnoreCase(proj.getProjectId())){
						tr.setProjectName(proj.getProjectName());
					}
				}
				for(Story story:stories){
					if(task.getStoryId()!=null && task.getStoryId().equalsIgnoreCase(story.getStoryId())){
						tr.setStoryTitle(story.getStoryTitle());
						tr.setStoryDesc(story.getStoryDescription());
						tr.setStoryStatus(story.getStatus());
					}
				}
				for(TeamMemberResponse tm:teamMembers){
					if(task.getTeamMemberEmployeeId()!=null && task.getTeamMemberEmployeeId().equalsIgnoreCase(tm.getTeamMemberEmployeeId())){
						tr.setTeamMemberName(tm.getTeamMemberName());
					}
				}
				taskRes.add(tr);
			}
		}
		
		return taskRes;
	}

	public List<TaskResponse> fetchTask(String taskId) {
		Query query=new Query(Criteria.where("taskId").is(taskId));
		List<Task> tasks=mongoTemplate.find(query,Task.class,COLLECTION_NAME);
		List<TaskResponse> taskRes=new ArrayList<TaskResponse>();
		List<Project> projects=projectDL.fetchProject();
		List<Story> stories=storyDL.fetchStory();
		List<TeamMemberResponse> teamMembers=teamService.getTeamMember();
		if(tasks!=null && tasks.size()>0){
			for(Task task:tasks){
				TaskResponse tr=map2VO(task);
				for(Project proj:projects){
					if(task.getProjectId()!=null && task.getProjectId().equalsIgnoreCase(proj.getProjectId())){
						tr.setProjectName(proj.getProjectName());
					}
				}
				for(Story story:stories){
					if(task.getStoryId()!=null && task.getStoryId().equalsIgnoreCase(story.getStoryId())){
						tr.setStoryTitle(story.getStoryTitle());
						tr.setStoryDesc(story.getStoryDescription());
						tr.setStoryStatus(story.getStatus());
					}
				}
				for(TeamMemberResponse tm:teamMembers){
					if(task.getTeamMemberEmployeeId()!=null && task.getTeamMemberEmployeeId().equalsIgnoreCase(tm.getTeamMemberEmployeeId())){
						tr.setTeamMemberName(tm.getTeamMemberName());
					}
				}
				taskRes.add(tr);
			}
		}
		
		return taskRes;
	}
	public void deleteTask(Task task) {
		mongoTemplate.remove(task);
	}
	private TaskResponse map2VO(Task task){
		TaskResponse result=new TaskResponse();
		result.setTaskId(task.getTaskId());
		result.setProjectId(task.getProjectId());
		result.setStoryId(task.getStoryId());
		result.setStoryTitle(task.getStoryTitle());
		result.setStoryDesc(task.getStoryDesc());
		result.setTaskTitle(task.getTaskTitle());
		result.setStatus(task.getStatus());
		result.setTeamMemberEmployeeId(task.getTeamMemberEmployeeId());
		result.setCreatedDate(task.getCreatedDate());
		result.setUpdateDate(task.getUpdateDate());
		return result;
	}
}
