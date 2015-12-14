angular.module('UserController', [])

    .controller('UserController', function($scope, $http, Users) {
        $scope.formData = {};
        console.log("controler");
    
        Users.get()
            .success(function(data) {
                $scope.users = data;
            });

        $scope.createUser = function() {
            $('#myModal').modal('hide');
            console.log("create");
            
            if(!$.isEmptyObject($scope.formData)){
                console.log("create 2");
                Users.create($scope.formData)
                    .success(function(data){
                        $scope.formData = {};
                        $scope.users = data;
                });
            };
        };

        $scope.deleteUser = function(id) {
           Users.delete(id)
                .success(function(data) {
                    $scope.users = data;
                });
        };
    });