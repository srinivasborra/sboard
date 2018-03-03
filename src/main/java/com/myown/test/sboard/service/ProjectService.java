package com.myown.test.sboard.service;

import java.util.List;

import com.myown.test.sboard.document.Project;

public interface ProjectService {
	public void addProject(Project project);
	public List<Project> fetchProject();
	public Project getProject(String projectId);
	public void updateProject(Project project);
	public void deleteProject(Project project);
	
}
