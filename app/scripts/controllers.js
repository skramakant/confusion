'use strict';

angular.module('confusionApp')

        .controller('MenuController', ['$scope','menuFactory', function($scope,menuFactory) {

            $scope.showMenu = false;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.dishes = [];
//            $scope.dishes=menuFactory.getDishes().then(function(response){
//              $scope.dishes = response.data;
//                $scope.showMenu = true;
//            },function(response){
//                $scope.message = "Error: "+response.status + " " + response.statusText;
//            });
            $scope.message = "Loading ...";
//            $scope.dishes = menuFactory.getDishes().query();
            menuFactory.getDishes().query(
                function(response) {
                    $scope.dishes = response;
                    $scope.showMenu = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                });

            $scope.select = function(setTab) {
                $scope.tab = setTab;

                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };

            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

            $scope.channels = channels;
            $scope.invalidChannelSelection = false;

        }])

        .controller('FeedbackController', ['$scope','feedbackFactory', function($scope,feedbackFactory) {
            $scope.message = "Loding..."
            $scope.feed = feedbackFactory.getFeedback();

            $scope.sendFeedback = function() {

                console.log($scope.feedback);

                if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    //var newFeed = new feedbackFactory($scope.feedback);
                    //newFeed.$save();
                    //feedbackFactory.$save($scope.feedback);
                    $scope.feed.save($scope.feedback);
                    
/*               //other way of saving data     
feedbackFactory.sendFeedback().save($scope.feedback).$promise.then(
					function (response) {
						console.log('saveOK response');
					},
					function (response) {
						console.log("Error: " + response.status + " " + response.statusText);
					}
				    );*/
                    
                    $scope.invalidChannelSelection = false;
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

        .controller('DishDetailController', ['$scope','$stateParams','menuFactory', function($scope,$stateParams,menuFactory) {
            $scope.showDish=false;
            $scope.dish = {};
//            menuFactory.getDish(parseInt($stateParams.id,10)).then(function(response){
//              $scope.dish = response.data;
//              $scope.showDish = true;
//            },function(response){
//                $scope.message = "Error: "+response.status + " " + response.statusText;
//            });
            $scope.message="Loading ...";
//            $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)});
            $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
            .$promise.then(
                            function(response){
                                $scope.dish = response;
                                $scope.showDish = true;
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
            );
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory',function($scope,menuFactory) {

//            Step 1: Create a JavaScript object to hold the comment from the form
            $scope.commentData = {
                                    rating:5,
                                   comment:"",
                                   author:"",
                                   date:""
                                 };
//            var currentDate = new Date().toISOString();
//            $scope.commentData.date = currentDate;
            $scope.radioButtons = [{value:"1", label:"1"},
                                   {value:"2",label:"2"},
                                   {value:"3",label:"3"},
                                   {value:"4",label:"4"},
                                   {value:"5",label:"5"},
                                  ];
//            $scope.submitComment = function () {
//
//                //Step 2: This is how you record the date
//                //"The date property of your JavaScript object holding the comment" = new //Date().toISOString();
//
//                 var currentDate = new Date().toISOString();
//                    $scope.commentData.date = currentDate;
//                // Step 3: Push your comment into the dish's comment array
//                $scope.dish.comments.push($scope.commentData);
//
//                //Step 4: reset your form to pristine
//                $scope.commentForm.$setPristine();
//                $scope.commentData = {
//                                    rating:5,
//                                   comment:"",
//                                   author:"",
//                                   date:""
//                                 };
//                //Step 5: reset your JavaScript object that holds your comment
//            };
            $scope.submitComment = function () {
                $scope.commentData.date = new Date().toISOString();
                console.log($scope.commentData);
                $scope.dish.comments.push($scope.commentData);

                menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
                                $scope.commentForm.$setPristine();
                                $scope.commentData = {rating:5, comment:"", author:"", date:""};
            };
        }])
        .controller('IndexController',['$scope','menuFactory','corporateFactory',function($scope,menuFactory,corporateFactory){
            $scope.showDish = false;
            $scope.showPromotion = false;
            $scope.showLeadership = false;
            $scope.message = "Loading...";
            $scope.featurePromotion={}; 
//            menuFactory.getPromotions(0).then(function(response){
//                $scope.featurePromotion = response.data;
//            });
            $scope.featurePromotion = menuFactory.getPromotions().get({id:0})
            .$promise.then(
                function(response){
                    $scope.featurePromotion = response;
                    $scope.showPromotion = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );
            $scope.specialist = {};
            $scope.specialist = corporateFactory.getLeaders().get({id:0})
            .$promise.then(
                function(response){
                    $scope.specialist = response;
                    $scope.showLeadership = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );
            //$scope.specialist = corporateFactory.getLeader(0);
            $scope.featureDish = {}; 
//            menuFactory.getDish(0).then(function(response){
//                $scope.featureDish = response.data;
//                $scope.showDish = true;
//            },function(response){
//                $scope.message = "Error: "+response.status + " " + response.statusText;
//            });
            //$scope.featureDish = menuFactory.getDishes().get({id:0});
            $scope.featureDish = menuFactory.getDishes().get({id:0})
                        .$promise.then(
                            function(response){
                                $scope.featureDish = response;
                                $scope.showDish = true;
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
                        );
        }])
        .controller('AboutController',['$scope','corporateFactory',function($scope,corporateFactory){
            //$scope.leaders = corporateFactory.getLeaders();
            $scope.showLeadership = false;
            $scope.message = "Loading...";
            $scope.leaders = [];
            corporateFactory.getLeaders().query(
                function(response) {
                    $scope.leaders = response;
                    $scope.showLeadership = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                });
        }])

;
