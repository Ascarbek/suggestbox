/**
 * Created by Ascarbek on 02.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('azSuggestBox')
        .directive('sbRemoveItemFromSelection', [function(){
            return {
                restrict: 'AE',
                link: function(scope, element, attrs){
                    element.on('click', function(){
                        scope.sbRemoveItemFromSelection();
                        scope.$apply();
                    });
                }
            }
        }])
})();
