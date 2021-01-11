angular
  .module("starter.controllers")
  .controller("ProductsCtrl", function(
    $scope,
    $rootScope,
    $http,
    $location,
    $timeout,
    $ionicModal,
    $stateParams,
    $ionicLoading,
    $ionicScrollDelegate,
    productsService,
    progressService,
    eCart,
    ionicMaterialInk
  ) {
    "use strict";

    $scope.cat_id = $stateParams.catid;
    $scope.catname = $stateParams.catname;
    console.log($scope.catname);
    $rootScope.sortProductBy = "sort_order-ASC";
    $scope.noRecords = false;
    //----------Lasy Loading of Products---------------------------
    $scope.loadMoreProducts = function() {
      // $scope.cat_id = 1;
      $scope.noRecords = false;

      let townID = sessionStorage.getItem("townID");

      const userID = sessionStorage.getItem("userID");
      const token = sessionStorage.getItem("AccessToken");

      $http
        .get(
          "http://kenndiweni-001-site3.atempurl.com/api/customerOrderHistory/" +
            userID
        )
        .then(function(response) {
          console.log(response);
          $scope.customerHistory = response.data; //// Customer Order History API
        });

      $scope.btnHistoryOrder = function(OrderID) {
        $http
          .get(
            "http://kenndiweni-001-site3.atempurl.com/api/orderDetail/" +
              OrderID
          )
          .then(function(response) {
            console.log(response.data.products);
            $rootScope.productHistory = response.data.products; //// Customer Order History API
            $scope.sortModal.hide();
            $location.path("app/orderHistory");
          });
      };

      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
      });

      productsService.getProducts($scope.cat_id, townID).then(
        function(response) {
          if (response.status) {



            if (response.data.length !== 0) {
              $scope.products = response.data;
              $scope.newProducts = response.data;
              $ionicLoading.hide();

              $scope.product_page++;
              $scope.noProductsAvailable = false; // On lasy loading.

              return;
            }

            if ($rootScope.productFilters !== undefined) {
              $scope.products = $rootScope.productFilters;
              $scope.newProducts = $rootScope.productFilters;
              $ionicLoading.hide();
              $scope.product_page++;
              $scope.noProductsAvailable = false; // On lasy loading.
               return
            }

            if (response.data.length === 0) {
              $scope.noRecords = true;
              $rootScope.productFilters = undefined
              $ionicLoading.hide();
            }

            //$scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            $scope.noProductsAvailable = true; // Off lasy loading.
            // if ($scope.product_page !== 1) $scope.noRecords = true;
            $ionicLoading.hide();
          }
        },
        function(error) {
          $scope.noProductsAvailable = true; // Off lasy loading.
          $ionicLoading.hide();
        }
      );

      // if ($scope.cat_id != 1 && $scope.cat_id != 7) {
      //   $scope.noProductsAvailable = true;
      //   $scope.noRecords = true;
      // } else {
      // }
    };

    //---------------------------
    $rootScope.showProducts = function(cat_id) {
      //$scope.category_id =$scope.cat_id;
      if (cat_id != "" && typeof cat_id != "undefined") $scope.cat_id = cat_id;

      $ionicScrollDelegate.scrollTop();
      $scope.selectedCat = findCategory(
        $rootScope.accordionArray,
        $scope.cat_id
      );
      $scope.parentCats = getParentCat(
        $rootScope.accordionArray,
        $scope.cat_id
      );

      $scope.noProductsAvailable = true; // Off lasy loading.
      $scope.product_page = 1;
      $scope.products = [];
      $scope.newProducts = [];

      $scope.loadMoreProducts();
    };
    $rootScope.showProducts();
    //---------------------------

    $scope.showProductDetail = function(pro_id) {
      $location.path("app/products-detail/" + pro_id);
    };

    //----------Cart Process--------------------
    $scope.selectId = "";
    $scope.AddToCart = function(prodObj) {
      $scope.selectId = prodObj.id;
      $timeout(function() {
        $scope.selectId = "";
      }, 700);
      eCart.addToCart(prodObj);
      $rootScope.cartItems = eCart.cartProducts.length;
    };

    //------Sub categoryes Options-----
    $ionicModal
      .fromTemplateUrl("js/products/products-cats.html", { scope: $scope })
      .then(function(modal) {
        $scope.categoryModal = modal;
      });
    $scope.catsClose = function() {
      $scope.categoryModal.hide();
    };
    $scope.catsShow = function() {
      $scope.categoryModal.show();
    };

    //------Sort Options-----
    $ionicModal
      .fromTemplateUrl("js/products/products-sort.html", { scope: $scope })
      .then(function(modal) {
        $scope.sortModal = modal;
      });
    $scope.sortClose = function() {
      $scope.sortModal.hide();
    };
    $scope.sortShow = function() {
      $scope.sortOptions = [
        { name: "Default", val: "sort_order-ASC" },
        { name: "Product Title A to Z", val: "name-ASC" },
        { name: "Product Title Z to A", val: "name-DESC" },
        { name: "Price- Low to High", val: "price-ASC" },
        { name: "Price- High to Low", val: "price-DESC" }
      ];
      $scope.sortModal.show();
    };
    $scope.setProductSort = function(data) {
      $rootScope.sortProductBy = data;
      $scope.sortModal.hide();
      $scope.showProducts();
    };
    $scope.pro_attr = "0-0-0";
    //-----------------------
    /*$scope.selectAttrib = function(pid,att_price,pro_price){
		 var tmpArray = att_price.split("|");
		 var newPrice = (parseFloat(pro_price)+parseFloat(tmpArray[3])).toFixed(2);
		 console.log(tmpArray[0]+" : "+tmpArray[1]+" : "+tmpArray[2]+" : "+tmpArray[3]);

		if(tmpArray[1]>0){
			 angular.element(document.querySelector('#sprice_'+pid)).addClass("hidePrice");
			 angular.element(document.querySelector('#attrprice_'+pid)).removeClass("hidePrice");
			 angular.element(document.querySelector('#attramt_'+pid)).html(newPrice);
			 var tmp = tmpArray[0]+"|"+tmpArray[1]+"|"+tmpArray[2];
			 angular.element(document.querySelector('#selectedattr_'+pid)).attr('attval',tmp);
		}else{
			 angular.element(document.querySelector('#sprice_'+pid)).removeClass("hidePrice");
			 angular.element(document.querySelector('#attrprice_'+pid)).addClass("hidePrice");
			 angular.element(document.querySelector('#attramt_'+pid)).html('');
			  angular.element(document.querySelector('#selectedattr_'+pid)).attr('attval','');
		}
	}*/
    //-----------------------

    ionicMaterialInk.displayEffect();
  })

  .controller("ProductsFilterCtrl", function(
    $scope,
    $http,
    $rootScope,
    $location,
    $stateParams,
    productsService,
    ionicMaterialInk
  ) {
    "use strict";
    $scope.cat_id = $stateParams.catid;

    $scope.brandFilter = [];
    $scope.priceFilter = [];
    $scope.discountFilter = [];

    $scope.productFilters = [];
    $scope.productFilternew = [];

    const townID = sessionStorage.getItem("townID");

    productsService.getFilterOptions($scope.cat_id, townID).then(
      function(response) {
        $scope.filterData = response.data;

        $scope.brandFilter = response.data;

        $scope.priceFilter = response.data.pricefilter;
        $scope.discountFilter = response.data.discountfilter;

        getSelectedFilter(
          $scope.brandFilter,
          productsService.getFilterData($scope.cat_id, "brands"),
          "brands"
        ); // Select Filter values
        getSelectedFilter(
          $scope.priceFilter,
          productsService.getFilterData($scope.cat_id, "price"),
          "price"
        ); // Select Filter values
        getSelectedFilter(
          $scope.discountFilter,
          productsService.getFilterData($scope.cat_id, "discount"),
          "discount"
        ); // Select Filter values
      },
      function(error) {
        alert("Error proudcts : " + error);
      }
    );

    //-------Watch filter changes------
    $scope.$watch(
      "brandFilter|filter:{selected:true}",
      function(nv) {
        $scope.bids = nv.map(function(brand) {
          return brand.productName;
        });
      },
      true
    );
    $scope.$watch(
      "priceFilter|filter:{selected:true}",
      function(nv) {
        $scope.prange_val = nv.map(function(pricerange) {
          return pricerange.pricefilter;
        });
      },
      true
    );
    $scope.$watch(
      "discountFilter|filter:{selected:true}",
      function(nv) {
        $scope.drange_val = nv.map(function(discrange) {
          return discrange.discountfilter;
        });
      },
      true
    );
    //-----------------------
    $scope.applyFilter = function() {
      debugger;

      let productFilter = $scope.bids;
      let delimiter = "%";

      let appendProductName = "";

      for (let index = 0; index < productFilter.length; index++) {
        appendProductName += productFilter[index] + "@";
      }

      $http
        .get(
          "http://kenndiweni-001-site3.atempurl.com/api/brandFilterProduct/" +
            appendProductName.slice(0, -1)
        )
        .then(function(success) {
          let filter = success.data;
          let filerArr = [];
          // $scope.productFilternew = success.data;s

          for (let index = 0; index < filter.length; index++) {
            let getFiler = filter[index];

            for (let x = 0; x < getFiler.length; x++) {
              filerArr.push(getFiler[x]);
            }
          }

          $rootScope.productFilters = filerArr;

          $location.path("app/products/" + 100000000);

          // $location.path("app/productFilter");
        });

      // productsService.setFilterData($scope.cat_id,'brands',$scope.bids); /*set barnds filters */
      // productsService.setFilterData($scope.cat_id,'price',$scope.prange_val); /*set price filters */
      // productsService.setFilterData($scope.cat_id,'discount',$scope.drange_val); /*set discount filters */

      // $rootScope.showProducts($scope.cat_id);
    };

    $scope.resetFilter = function() {
      $rootScope.brandsFobj = [];
      $rootScope.priceFobj = [];
      $rootScope.discFobj = [];
      $rootScope.showProducts($scope.cat_id);
      $location.path("app/products/" + $scope.cat_id);
    };
    //-----------------------
  })

  .controller("ProductsDetailCtrl", function(
    $scope,
    $rootScope,
    $stateParams,
    $timeout,
    eCart,
    productsService,
    ionicMaterialInk
  ) {
    "use strict";

    productsService.getProductDetail($stateParams.proid).then(
      function(response) {
        //alert("Success : "+response);
        $scope.productDetail = response.data[0];
      },
      function(error) {
        alert("Error proudcts : " + error);
      }
    );

    //-------------------------------
    $scope.selectId = "";
    $scope.AddToCart = function(prodObj) {
      $scope.selectId = prodObj.id;
      $timeout(function() {
        $scope.selectId = "";
      }, 700);

      eCart.addToCart(prodObj);
      $rootScope.cartItems = eCart.cartProducts.length;
    };
    //-------------------------------

    ionicMaterialInk.displayEffect();
  });
