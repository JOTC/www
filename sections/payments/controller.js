angular.module('jotc').controller('payments', [
  '$scope',
  '$modal',
  'jotc-auth',
  'jotc-api.payments',
  function($scope, $modal, $auth, $payments) {
    $scope.payments = $payments.list;
  }
]);
