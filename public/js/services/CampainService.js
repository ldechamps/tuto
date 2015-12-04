angular.module('campainService', [])

    // each function returns a promise object
    .factory('Campains', function($http) {
        return {
            get : function() {
                return $http.get('/api/campains');
            },
            create : function(todoData) {
                return $http.post('/api/campains', todoData);
            },
            delete : function(id) {
                return $http.delete('/api/campains/' + id);
            }
        }
});