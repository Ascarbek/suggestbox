/**
 * Created by Ascarbek on 02.12.2015.
 */
(function(){
    'use strict';

    var uid = 0;
    angular
        .module('azSuggestBox')
        .directive('sbDropdownItem', [function(){
            return {
                transclude: 'element',
                restrict: 'AE',
                link: function(scope, element, attrs, ctrl, transclude){
                    var blocks = [];
                    var listAlias = scope.listAlias;
                    var parentElement = element.parent();
                    scope.highlightedItem = -1;

                    scope.$watch('isOpen', function(){
                        if(scope.isOpen){
                            parentElement.removeClass('ng-hide');
                        }
                        else{
                            parentElement.addClass('ng-hide');
                        }
                    });

                    scope.$watchCollection('list',function(){
                        for(var b=0; b<blocks.length; b++){
                            blocks[b].clone[0].outerHTML = '';
                            blocks[b].scope.$destroy();
                        }

                        blocks = [];

                        for(var i=0; i<scope.list.length; i++) {
                            var currentItem = scope.list[i];
                            var newScope = scope.$new();
                            newScope[listAlias] = currentItem;

                            newScope.$index = i; // reserved word, need to check list alias for collision
                            newScope.$first = i==0;
                            newScope.$last = i==scope.list.length-1;

                            transclude(newScope, function (clone, scope) {
                                scope.hidden = false;
                                scope.hide = function(){
                                    angular.element(clone).addClass('ng-hide');
                                    scope.hidden = true;
                                };
                                scope.show = function(){
                                    angular.element(clone).removeClass('ng-hide');
                                    scope.hidden = false;
                                };

                                scope.selected = false;
                                scope.select = function(){
                                    angular.element(clone).addClass(scope.sbSelectedListItemClass);
                                    scope.selected = true;
                                };
                                scope.unSelect = function(){
                                    angular.element(clone).removeClass(scope.sbSelectedListItemClass);
                                    scope.selected = false;
                                };
                                scope.isSelected = function(){
                                    return scope.selected;
                                };

                                scope.highlight = function(){
                                    angular.element(clone).addClass('sb-list-item-highlight');
                                };
                                scope.unHighlight = function(){
                                    angular.element(clone).removeClass('sb-list-item-highlight');
                                };

                                blocks.push({scope: scope, clone: clone});

                                if(scope.$index == 0) {
                                    element.after(clone);
                                }
                                else{
                                    blocks[scope.$index-1].clone.after(clone);
                                }

                                clone.on('click', function(){
                                    scope.toggleItemSelection(scope.$index);
                                    scope.$apply();
                                });
                            });
                        }
                    });

                    scope.toggleItemSelection = function(itemId){
                        if(scope.sbMaxSelection == 1){
                            scope.indexes.forEach(function(m){
                                scope.unSelectListItem(m);
                            });
                            scope.indexes.splice(0, scope.indexes.length);
                            scope.model.splice(0, scope.model.length);
                        }

                        if(scope.sbAllowDuplicates){
                            scope.indexes.push(itemId);
                            scope.model.push(scope.list[itemId]);
                            scope.model[scope.model.length-1].$listIndex = itemId;
                        }
                        else {
                            var isFound = false;

                            for(var i=0; i<scope.indexes.length; i++){
                                if(scope.indexes[i] === itemId){
                                    scope.indexes.splice(i, 1);
                                    scope.unSelectListItem(itemId);
                                    isFound = true;
                                    break;
                                }
                            }
                            if(isFound) {
                                for (var ii = 0; ii < scope.model.length; ii++) {
                                    if(scope.model[ii].$listIndex == itemId){
                                        scope.model.splice(ii, 1);
                                    }
                                }
                            }
                            if(!isFound){
                                scope.indexes.push(itemId);
                                scope.model.push(scope.list[itemId]);
                                scope.model[scope.model.length-1].$listIndex = itemId;
                                scope.highlightNone();
                            }
                        }
                        //scope.suppressSyncing();
                    };

                    scope.highlightNone = function(){
                        if(scope.highlightedItem > -1){
                            blocks[scope.highlightedItem].scope.unHighlight();
                            scope.highlightedItem = -1;
                        }
                    };

                    scope.hideListItem = function(itemId){
                        if(itemId == scope.highlightedItem){
                            blocks[itemId].scope.unHighlight();
                            scope.highlightedItem = -1;
                        }
                        blocks[itemId].scope.hide();
                    };

                    scope.showListItem = function(itemId){
                        if(blocks[itemId]) {
                            blocks[itemId].scope.show();
                        }
                    };

                    scope.unSelectListItem = function(itemId){
                        blocks[itemId].scope.unSelect();
                    };

                    scope.selectListItem = function(itemId){
                        if(blocks[itemId]) {
                            if(itemId == scope.highlightedItem){
                                blocks[itemId].scope.unHighlight();
                                //scope.highlightedItem = -1;
                            }
                            blocks[itemId].scope.select();
                        }
                    };

                    scope.getSearchResultsCount = function(){
                        var res = 0;
                        for(var i=0; i<blocks.length; i++){
                            if(!blocks[i].scope.hidden){
                                res++;
                            }
                        }
                        return res;
                    };

                    scope.getListItemsCount = function(){
                        return blocks.length;
                    };

                    scope.highlightListItem = function(itemId){
                        if(scope.highlightedItem > -1) {
                            blocks[scope.highlightedItem].scope.unHighlight();
                        }
                        blocks[itemId].scope.highlight();
                        scope.highlightedItem = itemId;
                    };

                    scope.highlightNextItem = function(){
                        var cnt = 0, h = scope.highlightedItem;
                        do{
                            cnt++;
                            h++;
                            if(h >= blocks.length){
                                h = 0;
                            }
                        } while((cnt<blocks.length)&&(blocks[h].scope.hidden));
                        scope.highlightListItem(h);
                    };

                    scope.highlightPrevItem = function(){
                        var cnt = 0, h = scope.highlightedItem;
                        do{
                            cnt++;
                            h--;
                            if(h <= -1){
                                h = blocks.length - 1;
                            }
                        } while((cnt<blocks.length)&&(blocks[h].scope.hidden));
                        scope.highlightListItem(h);
                    };
                }
            }
        }])
})();
