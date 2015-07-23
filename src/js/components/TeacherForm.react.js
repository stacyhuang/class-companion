var React = require('react');
var TeacherActions = require('../actions/TeacherActions');
var AuthStore = require('../stores/AuthStore');

var TeacherForm = React.createClass({
  getInitialState: function(){
    return null;
  },

  componentWillMount: function(){
    if(!AuthStore.checkAuth()){
      this.render = function () {
        return false;
      }
      location.hash = '/';
    }
  },

  // Invoking the addClass method on our TeacherActions whenever a addClass user event occurs
  handleAddClass: function(e){
    e.preventDefault();
    var newClass = React.findDOMNode(this.refs.newClass).value;
    TeacherActions.addClass({classTitle: newClass, behavior: { 'Helping': 1, 'Good Job': 1, 'Bad Job': -1, 'Bullying': -1 }});
    React.findDOMNode(this.refs.newClass).value = '';
    this.props.closeModal();
  },

  render: function() {
    return (
      <div className="teacherForm">
        <div className="well text-center">
          <form onSubmit={this.handleAddClass}>
            <label for="">Give your class a name</label>
            <div className="form-group">
              <input type="text" ref="newClass" id="newClass" className="form-control" placeholder="Example: JD's English Class" />
            </div>
            <button type="submit" id="addNewClass" className="btn btn-primary btn-block submit-button">Create my class!</button>
          </form>
        </div> 
      </div>
    );
  }

});

module.exports = TeacherForm;
