angular
  .module("starter.controllers")
  .controller("IniscreenCtrl", function(
    $scope,
    $rootScope,
    $location,
    $ionicSideMenuDelegate,
    $ionicHistory
  ) {
    "use strict";

    $ionicSideMenuDelegate.canDragContent(false); // hide sidemenu

    $scope.loginButton = function() {
      $location.path("app/inilogin");
    };
    $scope.signupButton = function() {
      $location.path("app/inisignup");
    };
    $scope.skipButton = function() {
      $location.path("app/select-location");
    };
  })

  .controller("IniLocationCtrl", function(
    $scope,
    $rootScope,
    $location,
    $cordovaGeolocation,
    $timeout,
    usersService,
    progressService,
    $ionicSideMenuDelegate,
    $ionicHistory
  ) {
    "use strict";
    $ionicSideMenuDelegate.canDragContent(false); // hide sidemenu

    $scope.getAddress = function(attrs) {
      progressService.showLoader();
      var geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
      geocoder.geocode({ latLng: latlng }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            $scope.userAddress = results[1].formatted_address;
            progressService.hideLoader();
            $timeout(function() {
              $location.path("app/dashboard");
            }, 1500);
          } else {
            $scope.userAddress = "Location not found";
          }
        } else {
          $scope.userAddress = "Geocoder failed due to: " + status;
        }
      });
    };

    $scope.findLocation = function() {
      var posOptions = { timeout: 10000, enableHighAccuracy: false };
      $cordovaGeolocation.getCurrentPosition(posOptions).then(
        function(position) {
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
          $scope.getAddress({ lat: lat, lng: lng });
        },
        function(err) {
          // error
        }
      );
    };

    //$scope.findLocation();

    $scope.setLocation = function(data) {
      $scope.userLocation = data;

      var lng = data.geometry.location.lng();
      var lat = data.geometry.location.lat();
      $scope.userAddress = $scope.userLocation.formatted_address;
      $timeout(function() {
        $location.path("app/dashboard");
      }, 1000);
    };
  })

  .controller("IniSignupCtrl", function(
    $scope,
    $rootScope,
    $location,
    alertmsgService,
    $ionicSideMenuDelegate,
    $ionicHistory,
    $http
  ) {
    "use strict";
    $ionicSideMenuDelegate.canDragContent(false); // hide sidemenu

    $scope.regLocation = function(data) {
      $scope.userLocation = data;

      var lng = data.geometry.location.lng();
      var lat = data.geometry.location.lat();
      var lnglat = { lng: lng, lat: lat };
      $scope.iniRegister.city = $scope.userLocation.formatted_address;
    };

    $http
      .get("http://kenndiweni-001-site3.atempurl.com/api/provinceList")
      .then(function(response) {
        $scope.cuntryData = response.data;
      });

    $scope.iniRegister = {
      firstName: "",
      lastName: "",
      telephone: "",
      email: "",
      password: "",
      confirm: ""
    };

    $scope.provinceValue = null;
    $scope.townValue = null;

    $scope.Onchange = function() {
      $http
        .get(
          "http://kenndiweni-001-site3.atempurl.com/api/townList/" +
            this.provinceValue
        )
        .then(function(response) {
          $scope.townData = response.data;
        });
    };

    $scope.isEmailExist = function(form) {
      $http
        .get(
          "http://kenndiweni-001-site3.atempurl.com/api/isEmailExist/" +
            form.email.$modelValue
        )
        .then(function(response) {
          if (response.data.length !== 0) {
            alertmsgService.showMessage("Cet email existe déjà");
            return false;
          }
        });
    };

    $scope.userRegister = function(form) {
      if (form.telephone.$modelValue.length !== 10) {
        alertmsgService.showMessage(
          "La longueur du numéro de téléphone portable doit être de 10"
        );
        return false;
      }

      if (form.$valid) {
        let data = {
          firstName: form.firstName.$modelValue,
          lastName: form.lastName.$modelValue,
          townID: this.townValue,
          telephone: form.telephone.$modelValue,
          email: form.email.$modelValue,
          password: form.password.$modelValue
        };

        $http
          .post(
            "http://kenndiweni-001-site3.atempurl.com/api/customerCreation",
            data
          )
          .then(() => {
            $location.path("app/inilogin");
          })
          .catch(error => {
            console.log(error);
            alertmsgService.showMessage(
              "Un problème est survenu. Veuillez réessayer plus tard"
            );
            // $ionicLoading.hide();
          });
      }

      // if(form.$valid) {
      // 	$location.path("app/dashboard")
      // }
    };
  })

  .controller("IniLoginCtrl", function(
    $scope,
    $rootScope,
    $location,
    alertmsgService,
    $ionicSideMenuDelegate,
    $ionicLoading,
    $ionicHistory,
    $http
  ) {
    "use strict";
    $ionicSideMenuDelegate.canDragContent(false); // hide sidemenu

    $scope.iniLogin = { email: "", password: "" };

    $scope.userLogin = function(form) {
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
      });
      if (form.$valid) {
        let data = {
          password: form.password.$modelValue,
          email: form.email.$modelValue
        };

        $http
          .post(
            "http://kenndiweni-001-site3.atempurl.com/api/customerLogin",
            data
          )
          .then(result => {
            console.log(result);

            if (result.data === "") {
              // $rootScope.tostMsg("Invalid Credential");
              alertmsgService.showMessage(
                "Le mot de passe et l'e-mail sont incorrects"
              );
              $ionicLoading.hide();
              return false;
            }
            sessionStorage.clear();
            sessionStorage.setItem("firsrName", result.data.user[0].firstName);
            sessionStorage.setItem("userID", result.data.user[0].id);
            sessionStorage.setItem("AccessToken", result.data.Access);
            sessionStorage.setItem("lastName", result.data.user[0].lastName);
            sessionStorage.setItem("townID", result.data.user[0].townID);
            sessionStorage.setItem("telephone", result.data.user[0].telephone);
            sessionStorage.setItem("email", result.data.user[0].email);
            $ionicLoading.hide();
            // localStorage.setItem("email",result.data.user.email);

            $location.path("app/dashboard");
          })
          .catch(error => {
            console.log(error);
            alertmsgService.showMessage(
              "Un problème est survenu. Veuillez réessayer plus tard"
            );
            $ionicLoading.hide();
          });
      }
    };

    $scope.isEmailExistForgot = function(form) {
      $http
        .get(
          "http://kenndiweni-001-site3.atempurl.com/api/isEmailExist/" +
            form.email.$modelValue
        )
        .then(function(response) {
          if (response.data.length === 0) {
            alertmsgService.showMessage("Cet email n'existe pas");
            return false;
          }
        })
        .catch(error => {
          console.log(error);
          alertmsgService.showMessage(
            "Un problème est survenu. Veuillez réessayer plus tard"
          );
          $ionicLoading.hide();
        });
    };

    //-----------------------------
    $scope.iniReset = { email: "" };
    $scope.userResetPassword = function(form) {
      if (form.$valid) {
        // $scope.iniReset = { email: "" };

        $http
          .post(
            "http://kenndiweni-001-site3.atempurl.com/api/forgotPassword/" +
              form.email.$modelValue
          )
          .then(function(response) {
            $rootScope.showAlert(
              "Votre nouveau mot de passe a été envoyé à votre adresse e-mail."
            );
          })
          .catch(error => {
            console.log(error);
            alertmsgService.showMessage(
              "Un problème est survenu. Veuillez réessayer plus tard"
            );
            $ionicLoading.hide();
          });
      }
    };
  });
