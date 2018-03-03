package com.myown.test.sboard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.myown.test.sboard.DLImpl.ProjectDLImpl;
import com.myown.test.sboard.document.Project;

@Repository
public class ProjectServiceImpl implements ProjectService{

	@Autowired
	private ProjectDLImpl projectDL;
	@Override
	public void addProject(Project project) {
		projectDL.addProject(project);
	}

	@Override
	public List<Project> fetchProject() {
		return projectDL.fetchProject();
	}

	@Override
	public Project getProject(String projectId) {
		return projectDL.getProject(projectId);
	}

	@Override
	public void updateProject(Project project) {
		projectDL.updateProject(project);
	}

	@Override
	public void deleteProject(Project project) {
		projectDL.deleteProject(project);
	}

//	@Autowired
//	private MongoTemplate mongoTemplate;
//	
//	public static final String COLLECTION_NAME="project";
//	
//	public void addProject(Project project) {
//		if(!mongoTemplate.collectionExists(Project.class)){
//			mongoTemplate.createCollection(Project.class);
//		}
//		project.setProjectId(UUID.randomUUID().toString());
//		mongoTemplate.insert(project,COLLECTION_NAME);
//	}
//	
//	public List<Project> fetchProject(){
//		return mongoTemplate.findAll(Project.class,COLLECTION_NAME);
//	}
//	
//	public Project getProject(String projectId){
//		return mongoTemplate.findById(projectId, Project.class);
//	}
//	public void updateProject(Project project){
//		mongoTemplate.save(project, COLLECTION_NAME);
//	}
//	public void deleteProject(Project project){
//		mongoTemplate.remove(project,COLLECTION_NAME);
//	}
}
