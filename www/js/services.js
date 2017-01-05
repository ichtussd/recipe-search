angular.module('starter.services', [])


.factory('recipeService', function($http,ApiEndpoint) {
  // Might use a resource here that returns a JSON array
          var recipes = [];
          return {

                       getRecipes: function(q){
                			          return $http.get(ApiEndpoint.url + "&q="+q);
		                    },

	                  }
})

.factory('Data', function () {
var recipe = {};
  return {
    getRecipe: function () {
        return recipe;
    },
    setRecipe: function (recipeParam) {
        recipe = recipeParam;
    }
  }
})
