angular
  .module("starter.controllers")
  .controller("ConnectionCtrl", function(
    $scope,
    $rootScope,
    $location,
    $ionicLoading,
    $timeout,
    $cordovaNetwork,
    $ionicSideMenuDelegate
  ) {
    "use strict";

    $ionicSideMenuDelegate.canDragContent(false); // hide sidemenu

    $rootScope.noConnection = false;
    document.addEventListener(
      "deviceready",
      function() {
        $scope.checkConnection();
      },
      false
    );

    $scope.checkConnection = function() {
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
      });

      var isOnline = $cordovaNetwork.isOnline();
      if (isOnline) {
        $scope.noConnection = false;
        $ionicLoading.hide();
        $location.path("app/iniscreen");
      } else {
        //--------------------------
        if (window.Connection) {
          if (navigator.connection.type == Connection.NONE) {
            $scope.noConnection = true;
            $ionicLoading.hide();
          } else {
            $scope.noConnection = false;
            $ionicLoading.hide();
            $location.path("app/iniscreen");
          }
        }
        //--------------------------
      }
    };

    $location.path("app/iniscreen");
  });
