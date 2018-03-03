package com.myown.test.sboard.DLImpl;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.myown.test.sboard.document.Project;
import com.myown.test.sboard.utils.SBoardUtil;

@Repository
public class ProjectDLImpl {
	@Autowired
	private MongoTemplate mongoTemplate;
	
	public static final String COLLECTION_NAME="project";
	
	public void addProject(Project project) {
		if(!mongoTemplate.collectionExists(Project.class)){
			mongoTemplate.createCollection(Project.class);
		}
		Date curDate=new Date();
		project.setProjectId(UUID.randomUUID().toString());
		project.setCreatedOn(SBoardUtil.currentDate(curDate));
		mongoTemplate.insert(project,COLLECTION_NAME);
	}
	
	public List<Project> fetchProject(){
		Query query=new Query(Criteria.where("status").in("0","1"));
		List<Project> projects=mongoTemplate.find(query,Project.class, COLLECTION_NAME);
		//List<Story> stories=mongoTemplate.find(query, Story.class, COLLECTION_NAME);
		//return mongoTemplate.findAll(Project.class,COLLECTION_NAME);
		return projects;
	}
	
	public Project getProject(String projectId){
		return mongoTemplate.findById(projectId, Project.class);
	}
	public void updateProject(Project project){
		Date curDate = new Date();
		project.setUpdatedOn(SBoardUtil.currentDate(curDate));
		mongoTemplate.save(project, COLLECTION_NAME);
	}
	public void deleteProject(Project project){
		project.setStatus("2");
		updateProject(project);
		//mongoTemplate.remove(project,COLLECTION_NAME);
	}
	
}
