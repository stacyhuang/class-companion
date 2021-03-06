var AppDispatcher = require('../dispatcher/AppDispatcher');
var HomeworkConstants = require('../constants/HomeworkConstants');
var FirebaseStore = require('./FirebaseStore');
var EventEmitter = require('events').EventEmitter;
var objectAssign = require('object-assign');
var FirebaseStore = require('./FirebaseStore');
var _ = require('underscore');

var CHANGE_EVENT = 'change';

var firebaseRef = FirebaseStore.getDb();

var _store = {
  list: {},
  info: {},
  assignments: {},
  pastAssignments: {},
  monthAssignments : {},
  emails: {},
  parentEmails: {}
};

var addAssignment = function(assignment){
  var hwId = firebaseRef.child('classes/' + assignment.classId + '/assignments').push(assignment).key();

  HomeworkStore.emit(CHANGE_EVENT);
  setPastAssignments();
};

var initQuery = function(classId){
  firebaseRef.child('classes/' + classId).on('value', function(snapshot){
    var classData = snapshot.val();
    _store.info = classData.info;
    _store.assignments = classData.assignments;
    _store.list = classData.students;
    });
  HomeworkStore.emit(CHANGE_EVENT);
};

var endQuery = function(){
  firebaseRef.child('classes/'+_store.info.classId).off();
};

var removeAssignment = function(hwId){
  firebaseRef.child('classes/' + _store.info.classId + '/assignments/' + hwId ).remove();
};

var setPastAssignments = function () {
  var pastAssignments = {};
  var todaysDate = moment().format('MM-DD');
  var year = moment().format('YYYY');
  //loops through all assignments and filters ones that were due before today
  for (var assignment in _store.assignments) {
    if ((_store.assignments[assignment].dueDate.slice(0, 5) < todaysDate) && (year >= _store.assignments[assignment].dueDate.slice(6, 10))) {
      pastAssignments[assignment] = _store.assignments[assignment];
    }
  }
  _store.pastAssignments = pastAssignments;
};

var selectMonth = function(month){
  var monthObj = {};
  for(var key in _store.assignments){
    if(month.toString() === _store.assignments[key]["monthYear"][0]){
      monthObj[key] = _store.assignments[key];
    }
  }
  _store.monthAssignments = monthObj;
  HomeworkStore.emit(CHANGE_EVENT);
};

var addStudentEmail = function(email){
  // firebaseRef.child('classes/' + email.classId + '/emails/student').push(email);

  firebaseRef.child('classes/' + email.classId + '/students/' + email.studentId + '/email').set(email.email);
  HomeworkStore.emit(CHANGE_EVENT);
};

var addParentEmail = function(email){
  // firebaseRef.child('classes/' + email.classId + '/emails/parent').push(email);

  firebaseRef.child('classes/' + email.classId + '/students/' + email.studentId + '/parentEmail').set(email.email);
  HomeworkStore.emit(CHANGE_EVENT);
}

var HomeworkStore = objectAssign({}, EventEmitter.prototype, {
  // Invoke the callback function (ie. the _onChange function in TeacherDashboard) whenever it hears a change event
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb);
  },

  getInfo: function(){
    return _store.info;
  },
  getAssignments: function(){
    return _store.assignments;
  },
  getList: function(){
    return _store.list;
  },
  getPastAssignments: function(){
    var pastAssignments = {};
    //used to find today's date in MM/DD/YYYY
    var today = moment().format('MM-DD-YYYY');
    var year = moment().format('YYYY');
    //loops through all assignments and filters ones that were due before today
    for(var assignment in _store.assignments){
      if((_store.assignments[assignment].dueDate.slice(0,5) < today) && (year >= _store.assignments[assignment].dueDate.slice(6,10))){
          pastAssignments[assignment] = _store.assignments[assignment];
      }
    }
    return pastAssignments;
  },
  getMonthAssignments: function(){
    return _store.monthAssignments;
  },
  getEmails: function () {
      var studentEmails = {};
      for (var key in _store.list) {
        studentEmails[key] = _store.list[key]["email"];
      }
      _store.emails = studentEmails;
      return _store.emails;
    },

    getParentEmails: function () {
      var parentEmails = {};
      for (var key in _store.list) {
        parentEmails[key] = _store.list[key]["parentEmail"];
      }
      _store.parentEmails = parentEmails;
      return _store.parentEmails;
    }
  });


AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){
    case HomeworkConstants.ADD_ASSIGNMENT:
      addAssignment(action.data);
      HomeworkStore.emit(CHANGE_EVENT);
      break;
    case HomeworkConstants.INIT_QUERY:
      initQuery(action.data);
      HomeworkStore.emit(CHANGE_EVENT);
      break;
    case HomeworkConstants.END_QUERY:
      endQuery();
      HomeworkStore.emit(CHANGE_EVENT);
      break;
    case HomeworkConstants.REMOVE_ASSIGNMENT:
      removeAssignment(action.data);
      HomeworkStore.emit(CHANGE_EVENT);
      break;
    case HomeworkConstants.PAST_ASSIGNMENTS:
      getPastAssignments();
      HomeworkStore.emit(CHANGE_EVENT);
      break;
    case HomeworkConstants.MONTH_SELECTED:
      selectMonth(action.data);
      break;
    case HomeworkConstants.ADD_STUDENT_EMAIL:
      addStudentEmail(action.data);
      HomeworkStore.emit(CHANGE_EVENT);
      break;
    case HomeworkConstants.ADD_PARENT_EMAIL:
      addParentEmail(action.data);
      HomeworkStore.emit(CHANGE_EVENT);
      break;
    default:
      return true;
  }
});

module.exports = HomeworkStore;
