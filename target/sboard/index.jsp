<html ng-app="appScrumboard"> 
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" charset="UTF-8">
<link rel="stylesheet" href="resources/static/css/bootstrap.min.css"/>

<link rel="stylesheet" type="text/css" href="resources/static/css/app.css"/>
<link rel="stylesheet" href="resources/static/css/ng-grid.css"/>


<script type="text/javascript" src="resources/static/lib/jquery.min.js"></script>
<script type="text/javascript" src="resources/static/lib/angular.min.js"></script>
<script type="text/javascript" src="resources/static/lib/angular-route.min.js"></script>
 <script type="text/javascript" src="resources/static/lib/ui-bootstrap-tpls-0.13.4.js"></script>
<script type="text/javascript" src="resources/static/lib/ng-grid-1.3.2.js"></script>

<script type="text/javascript" src="resources/static/js/app.js"></script>
<script type="text/javascript" src="resources/static/js/service/projectservice.js"></script>
<script type="text/javascript" src="resources/static/js/controller/projectcontroller.js"></script>
<script type="text/javascript" src="resources/static/js/service/storyservice.js"></script>
<script type="text/javascript" src="resources/static/js/controller/storycontroller.js"></script>
<script type="text/javascript" src="resources/static/js/service/taskservice.js"></script>
<script type="text/javascript" src="resources/static/js/controller/taskcontroller.js"></script>
<script type="text/javascript" src="resources/static/js/service/teamservice.js"></script>
<script type="text/javascript" src="resources/static/js/controller/teamcontroller.js"></script>
<script type="text/javascript" src="resources/static/js/controller/maincontroller.js"></script>
<title>::Scrum Board::</title>
<base href=""/>
</head>
<body>
<nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="/sboard">Scrum Board</a>
    </div>
    <div class="collapse navbar-collapse" id="myNavbar">
      <ul class="nav navbar-nav">
        <li><a href="#/project">Project</a></li>
        <li><a href="#/story">Story</a></li>
        <li><a href="#/task">Task</a></li>
        <li><a href="#/team">Team</a></li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li><a href="#"><span></span> Login</a></li>
      </ul>
    </div>
  </div>
</nav>
 
<div class="container-fluid" style="height:640px;">
    <div class="col-sm-12">
    <div ng-view=""></div>
    </div>
  </div>
</div>
<footer class="container-fluid text-center">
  <p>Footer Text</p>
</footer>
</body>
</html>