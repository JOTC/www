angular.module('jotc').service('jotc-api.payments', [
  '$http',
  function($http) {
    var payments = [];

    $http.get('/data2/payments').success(function(data) {
      Array.prototype.splice.apply(payments, [0, payments.length].concat(data));
    });

    return {
      list: payments
    };
  }
]);
