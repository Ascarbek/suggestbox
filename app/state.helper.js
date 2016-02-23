/**
 * Created by Ascarbek on 25.01.2016.
 */
(function(){
    'use strict';

    angular
        .module('demo')
        .provider('stateHelper', ['$stateProvider', function($stateProvider){
            this.$get = function(){
                return {
                    addState : function(name, config){
                        $stateProvider
                            .state(name, config);
                    }
                }
            }
        }])
        .config(['$locationProvider', '$urlRouterProvider', '$httpProvider', function($locationProvider, $urlRouterProvider, $httpProvider){
            /*$locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });*/
            $locationProvider.hashPrefix('!');

            $urlRouterProvider.otherwise('/');
        }]);
})();
