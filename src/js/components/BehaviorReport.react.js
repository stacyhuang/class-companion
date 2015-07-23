var React = require('react');
var ClassroomStore = require('../stores/ClassroomStore');
var _ = require('underscore');
// require('../charts/amcharts');
// require('../charts/pie');
var PieChart = require('react-d3/piechart').PieChart;

var BehaviorDashboard = React.createClass({
  getInitialState: function(){
    //set list upon initialstate w/ ClassroomStore.getList
    return {
      list: ClassroomStore.getList(),
      info: ClassroomStore.getInfo(),
      graph: ClassroomStore.getGraph()
    }
  },

  _onChange: function(){
    this.setState({
        graph: ClassroomStore.getGraph(),
        list: ClassroomStore.getList()
    });
  },

  componentDidMount: function(){
    ClassroomStore.addChangeListener(this._onChange);    
  },

  componentWillUnmount: function(){
    ClassroomStore.removeChangeListener(this._onChange);
  },

  render: function(){
//     var pieData = [
//   {label: 'bullying', value: 40},
//   {label: 'goodJob', value: 55},
//   {label: 'badJob', value: 25 }
// ];

    return (
          <PieChart
      data={this.state.graph}
      width={400}
      height={400}
      radius={100}
      innerRadius={20}/>
    );
  }
});

module.exports = BehaviorDashboard;
