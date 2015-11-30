angular.module('clientService', [])

    // each function returns a promise object
    .factory('Clients', function($http) {
        return {
            get : function() {
                return $http.get('/api/clients');
            },
            create : function(todoData) {
                return $http.post('/api/clients', todoData);
            },
            delete : function(id) {
                return $http.delete('/api/clients/' + id);
            }
        }
});