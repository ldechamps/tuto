angular.module('UserService', [])

    // each function returns a promise object
    .factory('Users', function($http) {
        return {
            get : function() {
                return $http.get('/app/users');
            },
            create : function(todoData) {
                return $http.post('/app/users', todoData);
            },
            delete : function(id) {
                return $http.delete('/app/users/' + id);
            }
        }
});