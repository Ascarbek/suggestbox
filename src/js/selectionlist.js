/**
 * Created by Ascarbek on 02.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('azSuggestBox')
        .directive('sbSelectionItem', [function(){
            return {
                transclude: 'element',
                restrict: 'AE',
                link: function(scope, element, attrs, ctrl, transclude){

                    var blocks = [];
                    var modelAlias = scope.modelAlias;

                    scope.$watchCollection('model',function(){
                        for(var b=0; b<blocks.length; b++){
                            blocks[b].clone[0].outerHTML = '';
                            blocks[b].scope.$destroy();
                        }

                        blocks = [];

                        for(var i=0; i<scope.model.length; i++) {
                            var currentModel = {};
                            var newScope = scope.$new();

                            if(typeof scope.model[i] == 'number'){
                                currentModel = scope.list[scope.model[i]];
                                newScope.$itemId = scope.model[i];
                            }
                            else{
                                currentModel[scope.sbNewItemField] = scope.model[i];
                            }
                            newScope[modelAlias] = currentModel;

                            newScope.$index = i; //reserved word
                            transclude(newScope, function (clone, scope) {
                                scope.sbRemoveItemFromSelection = function(){
                                    if((!scope.sbAllowFreeText)||(scope.sbAllowAddItem)){
                                        scope.unSelectListItem(scope.$itemId);
                                    }

                                    scope.model.splice(scope.$index, 1);
                                };

                                blocks.push({scope: scope, clone: clone});

                                if(scope.$index == 0) {
                                    element.after(clone);
                                }
                                else{
                                    blocks[scope.$index-1].clone.after(clone);
                                }
                            });
                        }
                    });

                    scope.getSelectionCount = function(){
                        return scope.model.length;
                    };

                }
            }
        }]);
})();
