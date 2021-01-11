angular.module('starter.services')
.factory('usersService', function($http) {
  'use strict';

  var service = {
	userDetails: function () {
		 		 return $http.get("data/user/account.json");
    },
	userLogout: function (token) {


     const headers = { 'Authorization': 'Bearer '+token+'', 'Content-Type': 'application/json' }
    //  var myHeaders = new Headers();

    //  myHeaders.set('Content-Type', 'application/json');
    //  myHeaders.set('Authorization', 'Bearer ');

		 return $http.post("http://kenndiweni-001-site3.atempurl.com/api/loginOut",null,{headers});
    },
	getCountries: function () {
		 return $http.get("/data/user/countries.json");
    },

  };

  return service;
});
