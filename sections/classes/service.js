angular.module('jotc').service('jotc-api.classes', [
  '$http',
  function($http) {
    var _updateHandlers = [];
    var classes = [];
    var classTypes = [];

    $http.get('/data2/classes').success(function(data) {
      Array.prototype.splice.apply(classes, [0, classes.length].concat(data));
      for (var i = 0; i < classes.length; i++) {
        classes[i].startDate = new Date(classes[i].startDate);
        classes[i].endDate = new Date(classes[i].endDate);
      }
      triggerUpdateHandler();
    });
    $http.get('/data2/classes/types').success(function(data) {
      Array.prototype.splice.apply(
        classTypes,
        [0, classTypes.length].concat(data)
      );
    });

    var create = function(newClass, callback) {
      $http.post('/data2/classes', newClass).success(function(data) {
        data.startDate = new Date(data.startDate);
        data.endDate = new Date(data.endDate);

        classes.push(data);

        triggerUpdateHandler();

        if (callback) {
          callback();
        }
      });
    };

    var clss = function(classID) {
      return Object.freeze({
        update: function(newClass, callback) {
          $http.put('/data2/classes/' + classID, newClass).success(function() {
            for (var i = 0; i < classes.length; i++) {
              if (classes[i]._id === classID) {
                classes[i] = newClass;
                classes[i].endDate = new Date(
                  newClass.startDate.getTime() +
                    (newClass.numberOfWeeks - 1) * 604800000
                );
                break;
              }
            }

            triggerUpdateHandler();

            if (callback) {
              callback();
            }
          });
        },
        delete: function(callback) {
          $http.delete('/data2/classes/' + classID).success(function() {
            for (var i = 0; i < classes.length; i++) {
              if (classes[i]._id === classID) {
                classes.splice(i, 1);
                break;
              }
            }

            triggerUpdateHandler();

            if (callback) {
              callback();
            }
          });
        },
        deleteRegistrationForm: function(callback) {
          $http
            .delete('/data2/classes/' + classID + '/registrationForm')
            .success(function() {
              for (var i = 0; i < classes.length; i++) {
                if (classes[i]._id === classID) {
                  classes[i].registrationFormPath = '';
                  break;
                }
              }

              if (callback) {
                callback();
              }
            });
        }
      });
    };

    var submitPayment = function(token, classID, dollars, email, done) {
      $http
        .post('/data2/payments', {
          token: token,
          amount: dollars * 100,
          email: email,
          classID: classID
        })
        .success(function() {
          done(true);
        })
        .error(function() {
          done(false);
        })
    };

    var addUpdateHandler = function(handler) {
      if (handler && typeof handler === 'function') {
        _updateHandlers.push(handler);
      }
    };

    var triggerUpdateHandler = function() {
      for (var i in _updateHandlers) {
        _updateHandlers[i]();
      }
    };

    return {
      list: classes,
      types: classTypes,
      class: clss,
      create: create,
      onUpdate: addUpdateHandler,
      submitPayment: submitPayment
    };
  }
]);
