angular
  .module("starter.controllers")
  .controller("CartCtrl", function(
    $scope,
    $rootScope,
    $ionicLoading,
    alertmsgService,
    $location,
    eCart,
    ionicMaterialInk
  ) {
    "use strict";
    $rootScope.cartRefresh = function() {
      $scope.cartProducts = eCart.cartProducts;
      $rootScope.cartTotal = eCart.cartTotal();
      if (eCart.cartProducts.length > 0)
        $rootScope.cartItems = eCart.cartProducts.length;
      else $rootScope.cartItems = "";
    };

    $rootScope.cartRefresh();

    //------------Update Qty-------------------------------
    $scope.updateQty = function(prodObj, type) {

      if (type == "add") {
        var newqty = parseInt(prodObj.purchaseQuantity);
        eCart.addOneProduct(prodObj);
      } else {
        eCart.removeOneProduct(prodObj);
        var newqty = parseInt(prodObj.purchaseQuantity);
      }

      if (newqty > 0) {
        if (eCart.isAvailable) {
          $rootScope.cartRefresh();
        } else {
          alertmsgService.showMessage(
            "The product become out of the stock, you can not buy more quantity of this product."
          );
        }
      } else {
        $scope.removeProduct(prodObj);
      }

      /*if(newqty>0){
			$rootScope.cartRefresh();
		}else{
			$scope.removeProduct(prodObj);
		}*/
    };
    //----------Remove Item---------------------------------
    $scope.removeProduct = function(prodObj) {
      eCart.removeProduct(prodObj);
      $rootScope.cartRefresh();
    };
    //--------------------------------------------
    $scope.deliveryAddress = function() {
      $location.path("app/delivery-address");
    };

    ionicMaterialInk.displayEffect();
  })

  .controller("CartDeliveryCtrl", function(
    $scope,
    $http,
    $rootScope,
    $ionicModal,
    $location,
    usersService,
    alertmsgService,
    eCart,
    ionicMaterialInk
  ) {
    "use strict";

    //------------------------------------
    //$rootScope.billingAddress = '';
    //  $rootScope.shipingAddress = [];
    $scope.getBillShipAddress = function() {
      // $http.get("data/product/paymentaddress.json").then(
      //   function(response) {
      //     if (response.data.success) {
      //       $scope.billAddresses = response.data.data.addresses;
      //       $scope.shipAddresses = response.data.data.addresses;
      //     } else {
      //       $scope.billAddresses = [];
      //       $scope.shipAddresses = [];
      //     }
      //   },
      //   function(error) {
      //     $rootScope.tostMsg(error);
      //   }
      // );
    };

    $scope.getBillShipAddress();
    //------------Address Modal----------------------
    $ionicModal
      .fromTemplateUrl("js/cart/add-address.html", { scope: $scope })
      .then(function(modal) {
        $scope.addressModal = modal;
      });
    $scope.AddressClose = function() {
      $scope.addressModal.hide();
    };
    $scope.addAddress = function() {
      $scope.cuntryData = [
        { country_id: "", name: "-- Select Country --" },
        { country_id: "99", name: "India" }
      ];
      usersService.getCountries().then(function(response) {
        if (response.success) {
          $scope.cuntryData = $scope.cuntryData.concat(response.data);
        }
      });

      $rootScope.billshipAddress = {
        firstname: "",
        lastname: "",
        country_id: "",
        address_1: "",
        city: "",
        time: "",
        postcode: "",
        zone_id: "1433"
      };

      $scope.addressModal.show();

      this.billshipAddress.firstname = sessionStorage.getItem("firsrName");
      this.billshipAddress.lastname = sessionStorage.getItem("lastName");
    };
    //-----------Add Billing Address-----------------------
    $scope.saveAddress = function(form) {
      if (form.$valid) {
        $scope.saveShippingAddress($scope.shipAddresses);
      }
    };

    // $scope.saveBillingAddress = function(data, stype) {
    //   $scope.billAddresses.push(data);
    //   $scope.addressModal.hide();
    // };

    $scope.saveShippingAddress = function(data, stype) {
      let model = {};

      let shipAddresses = [];

      model.address_1 = this.billshipAddress.address_1;
      model.isaddress = true;

      shipAddresses.push(model);

      $scope.shipAddresses = shipAddresses;
      $scope.addressModal.hide();
    };
    //----------------------------------
    if (typeof $rootScope.billingAddress == "undefined")
      $rootScope.billingAddress = "";
    $scope.selectBillAddress = function(value) {
      $rootScope.billingAddress = value;

      var tmpdata = { payment_address: "existing", address_id: value };
      //$scope.saveBillingAddress(tmpdata,'set');
    };

    //----------------------------------
    if (typeof $rootScope.shippingAddress == "undefined")
      $rootScope.shippingAddress = "";
    $scope.selectShipAddress = function(value) {
      $rootScope.shippingAddress = value;
      var tmpdata = { shipping_address: "existing", address_id: value };
      //$scope.saveShippingAddress(tmpdata,'set');
    };
    //----------------------------------

    $scope.deliveryOptions = function() {
      if ($rootScope.shippingAddress == "") {
        alertmsgService.showMessage("Sélectionnez l'adresse de livraison.");
      } else {
        $location.path("app/delivery-options");
      }
    };

    //----------------------------------

    ionicMaterialInk.displayEffect();
  })

  .controller("CartOptionsCtrl", function(
    $scope,
    $http,
    $rootScope,
    ionicDatePicker,
    $ionicModal,
    $location,
    eCart,
    alertmsgService,
    ionicMaterialInk
  ) {
    "use strict";

    $scope.placeOrder = function() {
      let fees = true;

      if (fees) {
        $location.path("app/place-order");
      } else {
        alertmsgService.showMessage("Select shipping method first to proceed.");
      }

      // if ($rootScope.shppingMethod != "") {
      //   $location.path("app/place-order");
      // } else {
      //   alertmsgService.showMessage("Select shipping method first to proceed.");
      // }
    };

    $http
      .get("data/product/cart/shippingmethods.json")
      .then(function(response) {
        $scope.shippingData = response.data.shipping_methods;
      });

    if (typeof $rootScope.shppingMethod == "undefined")
      $rootScope.shppingMethod = "";
    $scope.selectShipMethod = function(data) {
      $rootScope.shppingMethod = data.code;
      $rootScope.shppingMethodData = data;
    };
    //-------------DatePicker---------------------
    var cdate = new Date();
    var nextMonth = cdate.getMonth() + 1;
    var monthEnd = new Date(cdate.getFullYear(), nextMonth + 1, 0).getDate();

    $rootScope.currntDate =
      cdate.getFullYear() +
      "-" +
      (cdate.getMonth() + 1) +
      "-" +
      cdate.getDate();

    var ipObj1 = {
      callback: function(val) {
        //Mandatory
        var sDate = new Date(val);
        $rootScope.currntDate =
          cdate.getFullYear() +
          "-" +
          (cdate.getMonth() + 1) +
          "-" +
          cdate.getDate();
      },
      disabledDates: [
        //Optional
        new Date("2016-22-04"),
        new Date("2016-16-06"),
        new Date(1439676000000)
      ],
      from: new Date(), //Optional
      to: new Date(cdate.getFullYear(), nextMonth, monthEnd), //Optional
      inputDate: new Date(), //Optional
      mondayFirst: true, //Optional
      disableWeekdays: [0], //Optional
      closeOnSelect: true, //Optional
      templateType: "popup" //Optional
    };

    $scope.openDatePicker = function() {
      ionicDatePicker.openDatePicker(ipObj1);
    };
    //----------------------------------

    ionicMaterialInk.displayEffect();
  })





  .controller("CartOrderCtrl", function(
    $scope,
    $http,
    eCart,
    $rootScope,
    $ionicModal,
    $location,
    $interval,
    $ionicLoading,
    alertmsgService,
    $cordovaInAppBrowser,
    ionicMaterialInk
  ) {
    "use strict";

    $scope.subTotal = $rootScope.cartTotal;

    $scope.grossTotal = parseInt($rootScope.cartTotal) + 1000;


    // parseInt($rootScope.shppingMethodData.price);

    $scope.isShow = false;
    $scope.telephone = null;

    $http.get("data/product/cart/paymentmethods.json").then(
      function(response) {
        $scope.paymentOptions = response.data.payment_methods;
      },
      function(error) {}
    );
    //----------------------------------------
    $scope.discountData = { coupon: "" };
    $scope.getCouponDiscount = function(form) {
      alertmsgService.showMessage("Invalid Coupon Code");
    };
    //------------Select Payment method----------------------------
    if (typeof $rootScope.paymentMethod == "undefined")
      $rootScope.paymentMethod = "";
    $scope.selectPaymentMethod = function(obj) {
      this.isShow = true;
      var paymentdata = {
        payment_method: obj.code,
        agree: "1",
        comment: obj.title
      };
      $rootScope.paymentMethod = obj.code;
    };
    //----------------------------------------
    $scope.orderConfirm = function() {
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner>'
      });

      console.log(parseInt(this.cartTotal))

      if (parseInt(this.cartTotal) < 20) {
        alertmsgService.showMessage(
          "Vous ne pouvez pas passer une commande car votre total est inférieur à 20 000 CDF"
        );
        $ionicLoading.hide();
        return false;
      }

      if (this.telephone == "") {
        alertmsgService.showMessage(
          "Veuillez sélectionner le mode de paiement."
        );
        return false;
      } else {
        let products = eCart.cartProducts;

        const userID = sessionStorage.getItem("userID");

        let delimiter = "%";
        let strAppendProduct = "";
        let strpurchaseQuantity = "";

        for (let index = 0; index < products.length; index++) {
          strAppendProduct += products[index].id + "%";
          strpurchaseQuantity += products[index].purchaseQuantity + "%";
        }

        let data = {
          customerID: userID,
          address: this.billshipAddress.address_1,
          time: this.billshipAddress.time,
          oderDate: this.currntDate,
          productIDs: strAppendProduct.slice(0, -1),
          purchaseQuatitys: strpurchaseQuantity.slice(0, -1),
          delimiter: delimiter,
          total: this.cartTotal,
          iscash: false,
          ispaymentSuccessful: false
        };

        $http
          .post(
            "http://kenndiweni-001-site3.atempurl.com/api/orderCreation",
            data
          )
          .then(function(reponse) {
            eCart.cartProducts = [];
            $rootScope.cartTotal = "";
            $rootScope.cartItems = "";
            $rootScope.paymentMethod = "";
            $rootScope.shppingMethod = "";
            $rootScope.billingAddress = "";
            $rootScope.shippingAddress = "";
            $ionicLoading.hide();
            $location.path("app/order-status/1");
          })
          .error(function() {
            $scope.order_fstatus = 2;
          });
      }
    };
    //-----------------------------------------
  })

  .controller("CartOrderStatusCtrl", function(
    $scope,
    $stateParams,
    ionicMaterialInk
  ) {
    "use strict";
    $scope.order_fstatus = $stateParams.status_id;

    ionicMaterialInk.displayEffect();
  });
