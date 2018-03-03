package com.myown.test.sboard.DLImpl;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.myown.test.sboard.document.Story;
import com.myown.test.sboard.utils.SBoardUtil;

@Repository
public class StoryDLImpl{
	
	@Autowired
	private MongoTemplate mongoTemplate;
	public static final String COLLECTION_NAME="story";
	
	public void addStroy(Story story) {
		Date curDate=new Date();
		story.setStoryId(UUID.randomUUID().toString());
		story.setCreatedOn(SBoardUtil.currentDate(curDate));
		mongoTemplate.insert(story);
	}

	public List<Story> fetchStory() {
		return mongoTemplate.findAll(Story.class,COLLECTION_NAME);
	}

	public void updateStory(Story story){
		Date curDate=new Date();
		story.setUpdatedOn(SBoardUtil.currentDate(curDate));
		mongoTemplate.save(story, COLLECTION_NAME);
	}
	
	public void deleteStory(Story story){
		mongoTemplate.remove(story);
	}
	
	public List<Story> getStoryByProject(String projectId){
		Query query=new Query(Criteria.where("projectId").is(projectId).andOperator(Criteria.where("status").is("1")));
		List<Story> stories=mongoTemplate.find(query, Story.class, COLLECTION_NAME);
		return stories;
	}
}
