/**
 * Created by Ascarbek on 01.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('azSuggestbox')
        .directive('azSuggestbox', [function(){
            return {
                transclude: true,
                restrict: 'AE',
                scope: {
                    sbList: '@',
                    sbModel: '='
                },
                link: function(scope, element, attrs, ctrl, transclude){

                    transclude(scope.$new(), function(clone, scope){
                        console.log(clone);
                        element.append(clone);
                    });

                    scope.$parent.$watch(attrs['sbList'], function(newval){
                        console.log(newval);
                    });

                    //console.log(scope.$parent.$eval(attrs['sbModel']));


                }
            }
        }
    ]);
})();

