angular.module('hotels', [])
		.constant("baseURL", baseURL)
		.service('hotelsFactory', ['$http', 'baseURL', function($http, 	baseURL){

			this.getHotels = function(filter, parameter){
				return $http.get(baseURL+"hotels");
			}

			this.getHotelsBy = function(filter, parameter){
				return $http.get(baseURL+"hotels?filter="+filter+"&parameter="+parameter);
			}

		}])
		.controller("hotelController", function($scope, hotelsFactory){

			$scope.five_stars = false; 
			$scope.four_stars = false; 
			$scope.three_stars = false; 
			$scope.two_stars = false; 
			$scope.one_stars = false; 
			$scope.all_stars = false;
			$scope.hotel_name = '';

			hotelsFactory.getHotels().then(function(response){
				$scope.hotels = response.data;
			});

			$scope.getNumber = function(num) {
			    return (new Array(num));
			}

			$scope.filterBy = function(filter, parameter) {

				var query = '';

				if(filter === 'stars'){
					query = getQuery();
				}else{
					query = $scope.hotel_name;
				}

				hotelsFactory.getHotelsBy(filter, query).then(function(response){
					$scope.hotels = response.data;	
				});

			}

			function getQuery(){
				var query = [];
				if($scope.all_stars){
					$scope.five_stars = true; 
					$scope.four_stars = true; 
					$scope.three_stars = true; 
					$scope.two_stars = true; 
					$scope.one_stars = true; 
				}

				if($scope.five_stars){
					query.push(5);
				} 
				if($scope.four_stars){
					query.push(4);
				} 
				if($scope.three_stars){
					query.push(3);
				}
				if($scope.two_stars){
					query.push(2);
				}
				if($scope.one_stars){
					query.push(1);
				}

				return query.join();
			}

		});