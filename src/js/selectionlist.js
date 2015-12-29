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
                    var modelAlias = scope.indexesAlias;

                    scope.$watchCollection('model',function(){
                        for(var b=0; b<blocks.length; b++){
                            blocks[b].clone[0].outerHTML = '';
                            blocks[b].scope.$destroy();
                        }

                        blocks = [];

                        for(var i=0; i<scope.model.length; i++) {
                            var currentModel = {};
                            var newScope = scope.$new();

                            currentModel = scope.model[i];
                            newScope[modelAlias] = currentModel;

                            newScope.$index = i; //reserved word
                            newScope.$first = i==0;
                            newScope.$last = i==scope.model.length-1;

                            transclude(newScope, function (clone, scope) {
                                scope.sbRemoveItemFromSelection = function(){
                                    //scope.suppressSyncing();
                                    if(scope[modelAlias].$listIndex){
                                        scope.unSelectListItem(scope[modelAlias].$listIndex);
                                        for(var l=0; l<scope.indexes.length; l++){
                                            if(scope[modelAlias].$listIndex == scope.indexes[l]) {
                                                scope.indexes.splice(l, 1);
                                                break;
                                            }
                                        }
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
