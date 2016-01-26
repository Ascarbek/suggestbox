/**
 * Created by Ascarbek on 02.12.2015.
 */
(function(){
    'use strict';

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

                            newScope.$index = i; // reserved words, need to check list alias for collision
                            newScope.$first = i==0;
                            newScope.$last = i==scope.list.length-1;

                            transclude(newScope, function (clone, scope) {
                                scope.hidden = false;
                                scope.hide = function(){
                                    if(!scope.hidden) {
                                        angular.element(clone).addClass('ng-hide');
                                        scope.hidden = true;
                                    }
                                };
                                scope.show = function(){
                                    if(scope.hidden) {
                                        if (!((scope.selected) && (scope.sbSelectedListItemClass == 'ng-hide'))) {
                                            angular.element(clone).removeClass('ng-hide');
                                        }
                                        scope.hidden = false;
                                    }
                                };

                                scope.selected = false;
                                scope.select = function(){
                                    if(!scope.selected) {
                                        angular.element(clone).addClass(scope.sbSelectedListItemClass);
                                        scope.selected = true;
                                    }
                                };
                                scope.unSelect = function(){
                                    if(scope.selected) {
                                        angular.element(clone).removeClass(scope.sbSelectedListItemClass);
                                        scope.selected = false;
                                    }
                                };
                                scope.isSelected = function(){
                                    return scope.selected;
                                };

                                scope.highlighted = false;
                                scope.highlight = function(){
                                    if(!scope.highlighted) {
                                        angular.element(clone).addClass(scope.sbHighlightedListItemClass);
                                        scope.highlighted = true;
                                    }
                                };
                                scope.unHighlight = function(){
                                    if(scope.highlighted) {
                                        angular.element(clone).removeClass(scope.sbHighlightedListItemClass);
                                        scope.highlighted = false;
                                    }
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
                        if(scope.sbCloseListOnSelect) {
                            scope.closeDropDown();
                            scope.highlightNone();
                            scope.$broadcast('clearSearch');
                        }

                        if(scope.sbAllowDuplicates){
                            scope.indexes.push(itemId);
                            scope.model.push(scope.list[itemId]);
                            scope.model[scope.model.length-1].$listIndex = itemId;
                            return;
                        }

                        for(var i=0; i<scope.indexes.length; i++){
                            if(scope.indexes[i] === itemId){
                                scope.indexes.splice(i, 1);
                                scope.unSelectListItem(itemId);
                                for (var ii = 0; ii < scope.model.length; ii++) {
                                    if(scope.model[ii].$listIndex == itemId){
                                        scope.model.splice(ii, 1);
                                    }
                                }
                                return;
                            }
                        }

                        if(scope.sbMaxSelection == 1){
                            scope.indexes.forEach(function(m){
                                scope.unSelectListItem(m);
                            });
                            scope.indexes.splice(0, scope.indexes.length);
                            scope.model.splice(0, scope.model.length);
                        }

                        scope.indexes.push(itemId);
                        scope.model.push(scope.list[itemId]);
                        scope.model[scope.model.length-1].$listIndex = itemId;
                        scope.highlightNone();

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
                        } while((cnt<blocks.length)&&((blocks[h].scope.hidden)||((blocks[h].scope.selected)&&(scope.sbSelectedListItemClass == 'ng-hide'))));
                        if(!blocks[h].scope.hidden) {
                            scope.highlightListItem(h);
                        }
                    };

                    scope.highlightPrevItem = function(){
                        var cnt = 0, h = scope.highlightedItem;
                        do{
                            cnt++;
                            h--;
                            if(h <= -1){
                                h = blocks.length - 1;
                            }
                        } while((cnt<blocks.length)&&((blocks[h].scope.hidden)||((blocks[h].scope.selected)&&(scope.sbSelectedListItemClass == 'ng-hide'))));
                        if(!blocks[h].scope.hidden) {
                            scope.highlightListItem(h);
                        }
                    };
                }
            }
        }])
})();
