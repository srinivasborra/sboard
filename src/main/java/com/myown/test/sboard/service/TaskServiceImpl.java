package com.myown.test.sboard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.myown.test.sboard.DLImpl.TaskDLImpl;
import com.myown.test.sboard.document.Task;
import com.myown.test.sboard.response.TaskResponse;

@Repository
public class TaskServiceImpl implements TaskService{
	@Autowired
	private TaskDLImpl taskDL;
	@Override
	public void createTask(Task task) {
		taskDL.createTask(task);
	}

	@Override
	public List<TaskResponse> getTask() {
		return taskDL.getTask();
	}

	@Override
	public void deleteTask(Task task) {
		taskDL.deleteTask(task);
	}

	@Override
	public TaskResponse fetchTask(String taskId) {
		List<TaskResponse> result=taskDL.fetchTask(taskId);
		if(result!=null && result.size()==1){
			return result.get(0);
		}
		return null;
	}

//	@Autowired
//	private MongoTemplate mongoTemplate;
//	@Autowired
//	private ProjectService projectService;
//	@Autowired
//	private StoryService storyService;
//	@Autowired
//	private TeamMemberService teamService;
//	
//	public static final String COLLECTION_NAME="task";
//	
//	@Override
//	public void createTask(Task task) {
//		Date curDate = new Date();
//		
//		if(task.getTaskId()!=null){
//			task.setUpdateDate(SBoardUtil.currentDate(curDate));
//			mongoTemplate.save(task);
//		}else{
//			task.setTaskId(UUID.randomUUID().toString());
//			task.setCreatedDate(SBoardUtil.currentDate(curDate));
//			mongoTemplate.insert(task);
//		}
//	}
//
//	@Override
//	public List<TaskResponse> getTask() {
//		List<Task> tasks=mongoTemplate.findAll(Task.class,COLLECTION_NAME);
//		//List<Task> tasks=mongoTemplate.group(COLLECTION_NAME,, Task.class);
//		List<TaskResponse> taskRes=new ArrayList<TaskResponse>();
//		List<Project> projects=projectService.fetchProject();
//		List<Story> stories=storyService.fetchStory();
//		List<TeamMemberResponse> teamMembers=teamService.getTeamMember();
//		if(tasks!=null && tasks.size()>0){
//			for(Task task:tasks){
//				TaskResponse tr=map2VO(task);
//				for(Project proj:projects){
//					if(task.getProjectId()!=null && task.getProjectId().equalsIgnoreCase(proj.getProjectId())){
//						tr.setProjectName(proj.getProjectName());
//					}
//				}
//				for(Story story:stories){
//					if(task.getStoryId()!=null && task.getStoryId().equalsIgnoreCase(story.getStoryId())){
//						tr.setStoryTitle(story.getStoryTitle());
//						tr.setStoryStatus(story.getStatus());
//					}
//				}
//				for(TeamMemberResponse tm:teamMembers){
//					if(task.getTeamMemberEmployeeId()!=null && task.getTeamMemberEmployeeId().equalsIgnoreCase(tm.getTeamMemberEmployeeId())){
//						tr.setTeamMemberName(tm.getTeamMemberName());
//					}
//				}
//				taskRes.add(tr);
//			}
//		}
//		
//		return taskRes;
//	}
//
//	@Override
//	public void deleteTask(Task task) {
//		// TODO Auto-generated method stub
//		
//	}
//	private TaskResponse map2VO(Task task){
//		TaskResponse result=new TaskResponse();
//		result.setTaskId(task.getTaskId());
//		result.setProjectId(task.getProjectId());
//		result.setStoryId(task.getStoryId());
//		result.setTaskTitle(task.getTaskTitle());
//		result.setStatus(task.getStatus());
//		result.setTeamMemberEmployeeId(task.getTeamMemberEmployeeId());
//		result.setCreatedDate(task.getCreatedDate());
//		result.setUpdateDate(task.getUpdateDate());
//		return result;
//	}

}
