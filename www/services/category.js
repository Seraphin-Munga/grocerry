angular.module('starter.services')
.factory('categoryService', function($http) {
  'use strict';

  var service = {
    getCategories: function () {
		 return $http.get("http://kenndiweni-001-site3.atempurl.com/api/categorySubcategoryList");

    }
  };

  return service;
});
