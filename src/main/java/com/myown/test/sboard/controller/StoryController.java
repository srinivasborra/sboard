package com.myown.test.sboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.view.RedirectView;

import com.myown.test.sboard.document.Story;
import com.myown.test.sboard.service.StoryService;

@Controller
public class StoryController {
	@Autowired
	public StoryService service;
	
	
	@RequestMapping(value="ui/story",method=RequestMethod.GET,produces="application/json")
	public @ResponseBody List<Story> fetchStory(){
		List<Story> stories=service.fetchStory();
		return stories;
	}
	
	@RequestMapping(value="story/save",method=RequestMethod.POST)
	public View createStory(@RequestBody Story story){
		if(story.getStoryId()!=null){
			service.updateStory(story);
		}else{
			service.addStroy(story);
		}
		
		return new RedirectView("/story");
	}
	
	@RequestMapping(value="story/delete",method=RequestMethod.POST)
	public View deleteStory(@RequestBody Story story){
		if(story.getStoryId()!=null){
			service.deleteStory(story);
		}
		return new RedirectView("/story");
	}
	
	@RequestMapping(value="story/project",method=RequestMethod.GET)
	public @ResponseBody List<Story> storyByProject(@RequestParam String projectId){
		List<Story> stories=service.getStoryByProject(projectId);
		for(Story s : stories){
			System.out.println(s.getStoryId());
		}
		return stories;
	}
}
