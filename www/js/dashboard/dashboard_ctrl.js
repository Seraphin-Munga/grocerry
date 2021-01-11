angular
  .module("starter.controllers")
  .controller("DashboardCtrl", function(
    $scope,
    $http,
    $rootScope,
    $ionicModal,
    usersService,
    categoryService,
    dashboardService,
    ionicMaterialInk
  ) {
    "use strict";

    //--------Get Category------------------------
    categoryService.getCategories().then(
      function(response) {
        console.log(response);
        $rootScope.accordionArray = response.data;
        $rootScope.searchDefaultCats = getAutoSuggest(
          $rootScope.accordionArray
        );
      },
      function(error) {
        $rootScope.tostMsg(error);
      }
    );
    //--------Banners------------------------
    dashboardService.getBanners().then(
      function(response) {
        $rootScope.bannerData = response.data.appbanners.slider;
      },
      function(error) {
        $rootScope.tostMsg(error);
      }
    );
    //--------Get User Data---------------------
    if (
      $rootScope.userData == "" ||
      typeof $rootScope.userData == "undefined"
    ) {
      usersService.userDetails().then(function(response) {
        if (response.success) {
          $rootScope.userData = response.data;
        }
      });
    }
    //----------------------------------

    // $scope.productAdsOne = null;
    // $scope.imageAdsOne = null;

    $http
      .get("http://kenndiweni-001-site3.atempurl.com/api/InterHomeList")
      .then(function(response) {
          console.log(response)
        $scope.productAdsOne = response.data[0].subcategoryID;
        $scope.imageAdsOne = response.data[0].Imagelink;

        $scope.productAdsTwo = response.data[1].subcategoryID;
        $scope.imageAdsTwo = response.data[1].Imagelink;

        $scope.productAdsThree = response.data[2].subcategoryID;
        $scope.imageAdsThree = response.data[2].Imagelink;
      });

    $scope.email = sessionStorage.getItem("email");

    ionicMaterialInk.displayEffect();
  });
