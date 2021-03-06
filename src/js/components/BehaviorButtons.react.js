var React = require('react');
var ClassroomStore = require('../stores/ClassroomStore');
var ClassroomActions = require('../actions/ClassroomActions');
var _ = require('underscore');

var BehaviorButtons = React.createClass({
  getInitialState: function(){
    return {
       info: ClassroomStore.getInfo(),
       list: ClassroomStore.getList()
    }
  },

  buttonClicked: function(points, index){
    this.props.closeBehaviorModal();
    ClassroomActions.behaviorClicked(this.props.studentId, index, points)
  },

  debugAddExperiencePoints: function() {
    var expPointsToAdd = this.state.expInputValue || 1
    ClassroomActions.behaviorClicked(this.props.studentId, null, expPointsToAdd)
    this.props.closeBehaviorModal();
  },

  debugHandleInputChange: function(event) {
    this.setState({expInputValue: parseInt(event.target.value)})
  },

  render: function() {
    var buttonClicked = this.buttonClicked;
    var studentBehaviors = _.map(this.state.info.behavior, function(points, index){
      return (        
        <div className="behaviorThumbnail col-xs-6" key={index}>
          <a className="thumbnail" onClick={buttonClicked.bind(null, points, index)}>
            {index}
          </a>
        </div>
      )
    });

    return (
      <div className="panel panel-info behaviorButtons">
        <div className="panel-heading">
          <button type="button" className="close" aria-label="Close" onClick={this.props.closeBehaviorModal}><span aria-hidden="true">&times;</span></button>
          <h3 className="panel-title">{this.props.studentTitle}</h3>
        </div>
        <div className="panel-body">
          <div className="row">
            {studentBehaviors}
          </div>
          {this.state.info.isDemo ?
            <div className="well">
              <div>Demo: quickly add behavior points and watch the pokemon evolve!</div>
              <button className="btn btn-success" onClick={this.debugAddExperiencePoints}>Add Points</button>
              <input type="text" className="demoMsg" placeholder="Try 1000" value={this.state.value} onChange={this.debugHandleInputChange}></input>
            </div>
           : null}
        </div>
      </div>
    );
  }

});

module.exports = BehaviorButtons;
