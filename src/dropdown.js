/**
 * Created by Ascarbek on 02.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('azSuggestBox')
        .directive('sbDropDown', [function(){
            return {
                transclude: true,
                restrict: 'AE',
                link: function(scope, element, attrs, ctrl, transclude){
                    var blocks = [];
                    var listAlias = scope.listAlias;

                    scope.$watch('isOpen', function(){
                        if(scope.isOpen){
                            element.removeClass('ng-hide');
                        }
                        else{
                            element.addClass('ng-hide');
                        }
                    });


                    scope.$watchCollection('list',function(){
                        for(var b=0; b<blocks.length; b++){
                            blocks[b].clone[1].outerHTML = '';
                            blocks[b].scope.$destroy();
                        }

                        blocks = [];

                        for(var i=0; i<scope.list.length; i++) {
                            var currentModel = scope.list[i];
                            var newScope = scope.$new();
                            newScope[listAlias] = currentModel;
                            transclude(newScope, function (clone, scope) {
                                blocks.push({scope: scope, clone: clone});
                                element.append(clone);
                            });
                        }
                    });
                }
            }
        }])
})();
