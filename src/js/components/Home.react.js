var React = require('react');
var Navbar = require('./Navbar.react');
var Login = require('./Login.react');
var Signup = require('./Signup.react');
var AuthStore = require('../stores/AuthStore');
var Modal = require('react-modal');

var appElement = document.app;
Modal.setAppElement(appElement);
Modal.injectCSS();

var Home = React.createClass({
	getInitialState: function(){
	  return {
	    loggedIn: AuthStore.checkAuth(),
      loginModalIsOpen: false,
      signupModalIsOpen: false
	  }
	},

	componentWillMount: function(){
	  if(AuthStore.checkAuth()){
	    this.render = function () {
	      return false;
	    }
	    location.hash = '/teacherDashboard';
	  }
	},

	componentDidMount: function(){
	  AuthStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function(){
	  AuthStore.removeChangeListener(this._onChange);
	},

	// Whenever data in the store changes, fetch data from the store and update the component state
	_onChange: function(){
	  this.setState({
	  	loggedIn: AuthStore.checkAuth()
	  })
	},

	openLoginModal: function(){
    this.setState({loginModalIsOpen: true});
  },
  
  closeLoginModal: function() {
    this.setState({loginModalIsOpen: false});
  },

  openSignupModal: function(){
    this.setState({signupModalIsOpen: true});
  },
  
  closeSignupModal: function() {
    this.setState({signupModalIsOpen: false});
  },

  render: function() {
    return (
      <div className="home">
      	<Navbar loggedIn={this.state.loggedIn} openLoginModal={this.openLoginModal} openSignupModal={this.openSignupModal} />
	      <div className="container">
	      	Hello! I am the home page! Please add content and make me pretty.
	      </div>
	      <Modal className="loginModal" isOpen={this.state.loginModalIsOpen} onRequestClose={this.closeLoginModal}>
	      	<Login closeLoginModal={this.closeLoginModal}/>
	      </Modal>
	      <Modal className="signupModal" isOpen={this.state.signupModalIsOpen} onRequestClose={this.closeSignupModal}>
	      	<Signup closeSignupModal={this.closeSignupModal}/>
	      </Modal>
	    </div>
    );
  }

});

module.exports = Home;
