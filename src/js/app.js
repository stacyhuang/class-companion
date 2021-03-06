var React = require('react');
var App = require('./components/App.react');
var Home = require('./components/Home.react');
var TeacherDashboard = require('./components/TeacherDashboard.react');
var TeacherClass = require('./components/TeacherClass.react');
var TeacherForm = require('./components/TeacherForm.react');
var ClassroomDashboard = require('./components/ClassroomDashboard.react');
var ReportsDashboard = require('./components/ReportsDashboard.react');
var HomeworkDashboard = require('./components/HomeworkDashboard.react')
var Signup = require('./components/Signup.react');
var Login = require('./components/Login.react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Redirect = Router.Redirect;
var RouterContainer = require('./services/RouterContainer');

var routes = (
  <Route handler={App}>
  	<DefaultRoute handler={Home}/>
    <Route path="/" handler={Home}/>
    <Redirect from="about" to="/" />
    <Redirect from="mobile" to="/" />
    <Redirect from="team" to="/" />
    <Route path="teacherDashboard" handler={TeacherDashboard}/>
    <Route path="teacherForm" handler={TeacherForm}/>
    <Route path="classroomDashboard/:id" handler={ClassroomDashboard}/>
    <Route path="reportsDashboard/:id" handler={ReportsDashboard}/>
    <Route path="homeworkDashboard/:id" handler={HomeworkDashboard}/>
    <Route path="*" handler={TeacherDashboard} />
  </Route>
);


var router = Router.create({routes: routes});
RouterContainer.set(router);

router.run(function(Root){
  React.render(<Root/>, document.getElementById('app'));
});
