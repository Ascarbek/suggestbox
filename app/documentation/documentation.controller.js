/**
 * Created by Ascarbek on 25.01.2016.
 */
(function(){
    'use strict';

    angular
        .module('demo')
        .controller('documentation', ['$scope', function($scope){
            ga('set', 'page', '/Documentation');
            ga('send', 'pageview');

            var vm = this;

        }]);
})();
