/**
 * Created by Ascarbek on 25.01.2016.
 */
(function(){
    'use strict';

    angular
        .module('demo')
        .controller('tutorial', ['$scope', function($scope){
            ga('set', 'page', '/Tutorial');
            ga('send', 'pageview');

            var vm = this;


        }]);
})();
