package com.myown.test.sboard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.myown.test.sboard.DLImpl.StoryDLImpl;
import com.myown.test.sboard.document.Story;

@Repository
public class StoryServiceImpl implements StoryService {
	@Autowired
	private StoryDLImpl storyDL;
	
	@Override
	public void addStroy(Story story) {
		storyDL.addStroy(story);
	}

	@Override
	public void updateStory(Story story) {
		storyDL.updateStory(story);
		
	}

	@Override
	public void deleteStory(Story story) {
		storyDL.deleteStory(story);
	}

	@Override
	public List<Story> fetchStory() {
		return storyDL.fetchStory();
	}

	@Override
	public List<Story> getStoryByProject(String projectId) {
		
		return storyDL.getStoryByProject(projectId);
	}
	
	
//	private MongoTemplate mongoTemplate;
//	public static final String COLLECTION_NAME="story";
//	@Override
//	public void addStroy(Story story) {
//		story.setStoryId(UUID.randomUUID().toString());
//		mongoTemplate.insert(story);
//	}
//
//	@Override
//	public List<Story> fetchStory() {
//		return mongoTemplate.findAll(Story.class,COLLECTION_NAME);
//	}
//
//	@Override
//	public void updateStory(Story story){
//		mongoTemplate.save(story, COLLECTION_NAME);
//	}
//	
//	@Override
//	public void deleteStory(Story story){
//		mongoTemplate.remove(story);
//	}
//	
//	public List<Story> getStoryByProject(String projectId){
//		Query query=new Query(Criteria.where("projectId").is(projectId));
//		List<Story> stories=mongoTemplate.find(query, Story.class, COLLECTION_NAME);
//		return stories;
//	}

}
