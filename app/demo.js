/**
 * Created by Ascarbek on 01.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('demo', ['azSuggestBox', 'ngAnimate', 'ngSanitize', 'ui.router'])
        .controller('demo', ['$scope', '$sce', function($scope, $sce){
            var vm = this;

            /*vm.model1 = [];
            vm.model1.push(vm.names[1]);
            vm.model1.push({
                "name" : "Cobie Smulders",
                "email" : "cobie_smulders@quis.com",
                "lorem" : "Risus feugiat in ante metus dictum at tempor commodo ullamcorper. Eros in cursus turpis massa tincidunt dui ut ornare lectus. Nisl condimentum id venenatis a. Duis at tellus at urna. Blandit aliquam etiam erat velit. Adipiscing enim eu turpis egestas pretium.",
                "cc" : "4716483910252886"
            });*/
        }]);
})();
