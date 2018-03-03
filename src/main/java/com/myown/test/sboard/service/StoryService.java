package com.myown.test.sboard.service;

import java.util.List;

import com.myown.test.sboard.document.Story;

public interface StoryService {
	public void addStroy(Story story);
	public void updateStory(Story story);
	public void deleteStory(Story story);
	public List<Story> fetchStory();
	public List<Story> getStoryByProject(String projectId);
}
