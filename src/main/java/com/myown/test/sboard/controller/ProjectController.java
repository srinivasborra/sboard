package com.myown.test.sboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.view.RedirectView;

import com.mongodb.MongoSocketOpenException;
import com.myown.test.sboard.document.Project;
import com.myown.test.sboard.service.ProjectService;

@Controller
public class ProjectController {
	@Autowired
	private ProjectService projectService;
	
	@RequestMapping(value="/project/save", method=RequestMethod.POST)
	public View createProject(@RequestBody Project project,BindingResult result){
	//public ModelAndView createProject(@Valid @ModelAttribute("project")Project project,BindingResult result){
//		if(result.hasErrors()){
//			ModelAndView model=new ModelAndView("create_edit");
//			return model;
//		}
		if(StringUtils.hasText(project.getProjectId())){
			projectService.updateProject(project);
		}else{
			projectService.addProject(project);
		}
		return new RedirectView("/project");
	}
	
	
	@RequestMapping(value="ui/project",method=RequestMethod.GET,produces = "application/json")
	public @ResponseBody List<Project> project(){
		List<Project> projects=projectService.fetchProject();
		return projects;
	}
	
	@RequestMapping(value="project/delete",method=RequestMethod.POST)
	public void deleteProject(@RequestBody Project project){
		projectService.deleteProject(project);
	}
	@RequestMapping(value="project/edit",method=RequestMethod.GET)
	public View editProject(@RequestParam String id,@ModelAttribute Project project){
		 project=projectService.getProject(id);
		 ModelAndView modelAndView = new ModelAndView("project");
		 modelAndView.addObject("projectObject",project);
		 return new RedirectView("/sboard/project");
	}
	
}
