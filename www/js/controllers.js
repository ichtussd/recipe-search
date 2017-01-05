angular.module('starter.controllers', ['starter.services','ionic'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('SearchCtrl',  ['$scope', 'recipeService','ApiEndpoint', '$ionicPopup','$http','$state','$ionicPopover',
        function($scope,recipeService,ApiEndpoint,$ionicPopup,$http,$state)
        {
          // fields, constants and arrays
            $scope.query='';
            $scope.recipes = [];
            $scope.filters = {};
            $scope.diets = ['balanced', 'high-protein', 'high-fiber', 'low-fat', 'low-carb', 'low-sodium'];
            $scope.health = [ 'alcohol-free',  'celery-free','crustacean-free','dairy-free','egg-free','fish-free','gluten-free','kidney-friendly','kosher','low-potassium','lupine-free','mustard-free','low-fat-abs','No-oil-added','low-sugar','paleo','peanut-free','pecatarian','pork-free','red-meat-free','sesame-free','shellfish-free','soy-free','sugar-conscious','tree-nut-free','vegan','vegetarian','wheat-free'];
            $scope.filters.filter_num_ingredients=500;
            $scope.filters.filter_calories_min = 0;
            $scope.filters.filter_calories_max = 10000;
            $scope.filters.filter_diet_type = '';
            $scope.filters.filter_allergy_type='';

//function to go to the detail page of the recipe.
            $scope.viewRecipe = function(recipe) {
                  console.log(recipe);
                    $state.go( 'app.recipe' , {recipeInfo: {recipeData: recipe} });
            }

//search function
            $scope.searchRecipe = function(query)
            {
                    //applying filters
                    query = query+"&calories=gte%20"+$scope.filters.filter_calories_min+",%20lte%20"+$scope.filters.filter_calories_max;
                    if( $scope.filters.filter_diet_type!=='') {
                        query = query+"&diet="+$scope.filters.filter_diet_type;
                    }
                    if($scope.filters.filter_allergy_type!=='') {
                        query = query+"&health="+$scope.filters.filter_allergy_type;
                    }
                  //  $scope.recipes[0] = query;

                    //calling recipe service to make request
                    recipeService.getRecipes(query).then(function(data)
                    {
                        var d = data.data;
                        var h = d.hits;
                        var count = 0;
                        //looping through results
                        angular.forEach(h,function(value,key) {
                          var r = value.recipe;
                          var recipe = [];
                          recipe.calories=r.calories;
                          recipe.image=r.image;
                          recipe.ingredients =r.ingredientLines;
                          recipe.ingredientsList = r.ingredients;
                          recipe.numOfIngredients = r.ingredients.length;
                          recipe.diet = r.dietLabels;
                          recipe.cautions = r.cautions;
                          recipe.cautionsCount = r.cautions.length;
                          recipe.healthLabels = r.healthLabels;
                          recipe.label=r.label;
                          recipe.source=r.source;
                          recipe.url=r.url;

                            if($scope.filters.filter_num_ingredients==500)  {
                                $scope.recipes[count] = recipe;
                            }
                            else {
                                  if(recipe.numOfIngredients<$scope.filters.filter_num_ingredients) {
                                            $scope.recipes[count] = recipe;
                                  }
                            }
                          count++;
                        });
                    });

          } //end of searchRecipe function


//filter function - based on calories
          $scope.showFilterCalories = function() {
                    var myPopup = $ionicPopup.show({
                      template: 'Min:<input type="Text" ng-model="filters.filter_calories_min"><br/>Max:<input type="Text" ng-model="filters.filter_calories_max">',
                      title: 'Filter By Calories',
                      subTitle: 'Type the minimum and maximum calories to filter the results by',
                      scope: $scope,
                      buttons: [
                        { text: 'Cancel' },
                        { text: '<b>Filter</b>', type: 'button-energized',
                          onTap: function(e)
                          {
                            if (!$scope.filters.filter_calories_max) {
                              e.preventDefault();
                            } else {
                             $scope.searchRecipe($scope.query);
                             return $scope.filters.filter_calories_max;

                            }
                          }
                        }
                      ]
                    });

                    }
//filter function - based on diets
              $scope.showFilterDiets = function() {
                    var myPopup = $ionicPopup.show({
                      template: '<div align="center"><select ng-model="filters.filter_diet_type"   ><option ng-repeat="diet in  diets">{{diet}}</option></select></div>',
                      title: 'Filter By Diet Type',
                      subTitle: 'Type the Diet you want to filter by',
                      scope: $scope,
                      buttons: [
                        { text: 'Cancel' },
                        { text: '<b>Filter</b>', type: 'button-energized',
                          onTap: function(e)
                          {
                            if (!$scope.filters.filter_diet_type) {
                              e.preventDefault();
                            } else {
                                $scope.searchRecipe($scope.query);
                              return $scope.filters.filter_diet_type;

                            }
                          }
                        }
                      ]
                    });
                    }

//filter function - based on number of ingredients

              $scope.showFilterIngredients = function() {
                    var myPopup = $ionicPopup.show({
                      template: 'Up to:<input type="Text" ng-model="filters.filter_num_ingredients"> ingredients',
                      title: 'Filter By Number of Ingredients',
                      subTitle: 'Type the number of ingredients you want to filter by',
                      scope: $scope,
                      buttons: [
                        { text: 'Cancel' },
                        { text: '<b>Filter</b>', type: 'button-energized',
                          onTap: function(e)
                          {
                            if (!$scope.filters.filter_num_ingredients) {
                              e.preventDefault();
                            } else {
                                $scope.searchRecipe($scope.query);
                              return $scope.filters.filter_num_ingredients;
                            }
                          }
                        }
                      ]
                    });
                    }

//filter function  - based on allergies and cautions
    $scope.showFilterCaution = function() {
                    var myPopup = $ionicPopup.show({
                      template: 'Allergies: <div align="center"><select  ng-model="filters.filter_allergy_type" ><option ng-repeat="allergy in  health">{{allergy}}</option></select></div>',
                      title: 'Filter By Allergies',
                      subTitle: 'Type the allergies you want to filter by',
                      scope: $scope,
                      buttons: [
                        { text: 'Cancel' },
                        { text: '<b>Filter</b>', type: 'button-energized',
                          onTap: function(e)
                          {
                            if (!$scope.filters.filter_allergy_type) {
                              e.preventDefault();
                            } else {
                              $scope.searchRecipe($scope.query);
                              return $scope.filters.filter_allergy_type;
                            }
                          }
                        }
                      ]
                    });
                    }
      }
])

.controller('RecipeCtrl',  ['$scope','$http','$state','$stateParams',
        function($scope,$http,$state,$stateParams)
        {
        console.log($stateParams);
        $scope.therecipe = $stateParams.recipeInfo;
        if($scope.therecipe!==null) {
          $scope.recipeData = $scope.therecipe.recipeData;

      }
        //$scope.therecipe = $stateParams.result;
        //console.log($scope.therecipe);

        }
        ])
