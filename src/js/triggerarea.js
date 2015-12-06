/**
 * Created by Ascarbek on 02.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('azSuggestBox')
        .directive('sbTriggerArea', [function(){
            return {
                restrict: 'AE',
                link: function(scope, element, attrs){
                    element.on('click', function(){
                        scope.sendBroadcast();

                        if(scope.dropDownState()){
                            scope.closeDropDown();
                        }
                        else{
                            scope.openDropDown();
                        }
                        scope.$apply();
                    });
                },
                controller: ['$rootScope', '$scope', function($rootScope, $scope){
                    $scope.sendBroadcast = function(){
                        $scope.weSentBroadcast = true;
                        $rootScope.$broadcast($scope.sbBroadcastEventName);
                    };
                }]
            }
        }])
})();
