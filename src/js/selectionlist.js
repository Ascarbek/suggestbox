/**
 * Created by Ascarbek on 02.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('azSuggestBox')
        .directive('sbSelectionList', [function(){
            return {
                transclude: true,
                restrict: 'AE',
                link: function(scope, element, attrs, ctrl, transclude){
                    var blocks = [];
                    var modelAlias = scope.modelAlias;

                    scope.$watchCollection('model',function(){
                        for(var b=0; b<blocks.length; b++){
                            blocks[b].clone[1].outerHTML = '';
                            blocks[b].scope.$destroy();
                        }

                        blocks = [];

                        for(var i=0; i<scope.model.length; i++) {
                            var currentModel = scope.model[i];
                            var newScope = scope.$new();
                            newScope[modelAlias] = currentModel;
                            transclude(newScope, function (clone, scope) {
                                scope.sbRemoveItemFromSelection = function(){
                                    scope.model.splice(scope.model.indexOf(scope[modelAlias]), 1);
                                };

                                blocks.push({scope: scope, clone: clone});
                                element.append(clone);
                            });
                        }
                    });

                }
            }
        }]);
})();
