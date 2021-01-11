angular.module('starter.services')
.factory('productsService', function($rootScope,$http) {
  'use strict';

  var service = {
    getProducts: function (catid,townID) {

			/*RewriteRule ^api/rest/products/category/?([0-9]+)/limit/?([0-9]+)/page/?([0-9]+)/order/?([a-zA-Z]+)/sort/?([a-zA-Z]+)/filtersdata/?([0-9,-|]+)  [L]*/

			/* var sortArray = $rootScope.sortProductBy.split('-');

			 var paging=5;
			 if(paged>1)paging = 10;

			if(catid>0){
				var fliter_val = '';
				var bf_val = service.getFilterData(catid,'brands');
				var pf_val = service.getFilterData(catid,'price');
				var df_val = service.getFilterData(catid,'discount');

				if(bf_val!='' || pf_val!='' || df_val!='' ) fliter_val = bf_val+"|"+pf_val+"|"+df_val;

				if(fliter_val!=''){
					var apiURL = '/data/product/productsfl'+catid+'-'+paging+'-'+paged+'-'+sortArray[1]+'-'+sortArray[0]+'-filter'+fliter_val;
				}else{
					var apiURL = '/data/product/products'+catid+'-'+paging+'-'+paged+'-'+sortArray[1]+'-'+sortArray[0];
				}
			}else{
				var apiURL = '/data/product/productsr'+title+'-10-'+paged+'-'+sortArray[1]+'-'+sortArray[0];
			}

			var showloader = 'Y'; if(paged>1)showloader = 'N';*/


		  return $http.get("http://kenndiweni-001-site3.atempurl.com/api/subcategoryProductList/" + catid + "/" + townID );
    },
    getProductDetail: function (pro_id) {

		 return $http.get("http://kenndiweni-001-site3.atempurl.com/api/product/" + pro_id);
    },
    getFilterOptions: function (cat_id,townID) {

		return $http.get("http://kenndiweni-001-site3.atempurl.com/api/filterProductList/" + townID);
    },
    setFilterData: function (cat_id,ftype,arrayval) {

		if(typeof($rootScope.brandsFobj)=='undefined')$rootScope.brandsFobj = [];
		if(typeof($rootScope.priceFobj)=='undefined')$rootScope.priceFobj = [];
		if(typeof($rootScope.discFobj)=='undefined')$rootScope.discFobj = [];

		if(arrayval!='' && typeof(arrayval)!='undefined'){
			 if(ftype=='brands')$rootScope.brandsFobj[cat_id]= toObject(arrayval);
			 if(ftype=='price')$rootScope.priceFobj[cat_id]= toObject(arrayval);
			 if(ftype=='discount')$rootScope.discFobj[cat_id]= toObject(arrayval);
		}else{
			  if(ftype=='brands') $rootScope.brandsFobj[cat_id]= {};
			  if(ftype=='price') $rootScope.priceFobj[cat_id]= {};
			  if(ftype=='discount') $rootScope.discFobj[cat_id]= {};
		}

    },
	getFilterData: function (cat_id,ftype) {
		if(typeof($rootScope.brandsFobj)=='undefined')$rootScope.brandsFobj = [];
		if(typeof($rootScope.priceFobj)=='undefined')$rootScope.priceFobj = [];
		if(typeof($rootScope.discFobj)=='undefined')$rootScope.discFobj = [];

		var tval = '';
		if(ftype=='brands')tval = $rootScope.brandsFobj[cat_id];
		if(ftype=='price')tval = $rootScope.priceFobj[cat_id];
		if(ftype=='discount')tval = $rootScope.discFobj[cat_id];

		if(typeof(tval)=='undefined')
			return '';
		else
			return Object.keys(tval).map(function (key) {return tval[key]});
	}

  };

  return service;
});


//waze
