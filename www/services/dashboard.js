angular.module('starter.services')
.factory('dashboardService', function($http) {
  'use strict';

  var service = {
    getBanners: function () {			
		return	$http.get("data/dashboard/appbanners.json")
    }
  };

  return service;
});


//waze
