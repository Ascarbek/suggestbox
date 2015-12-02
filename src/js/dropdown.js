/**
 * Created by Ascarbek on 02.12.2015.
 */
(function(){
    'use strict';

    var uid = 0;
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

                            var currentItem = scope.list[i];
                            var newScope = scope.$new();
                            newScope[listAlias] = currentItem;
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
                                scope.highlight = function(){
                                    angular.element(clone).addClass('sb-list-item-highlight');
                                };
                                scope.unHighlight = function(){
                                    angular.element(clone).removeClass('sb-list-item-highlight');
                                };

                                blocks.push({scope: scope, clone: clone});

                                element.append(clone);

                                clone.on('click', function(){
                                    scope.model.push(scope[listAlias]);
                                    scope.$apply();
                                });
                            });
                        }
                    });

                    scope.hideListItem = function(itemId){
                        blocks[itemId].scope.hide();
                    };

                    scope.showListItem = function(itemId){
                        blocks[itemId].scope.show();
                    };

                    scope.highlightedItem = -1;
                    scope.highlightListItem = function(itemId){
                        if(scope.highlightedItem > -1) {
                            blocks[scope.highlightedItem].scope.unHighlight();
                        }
                        blocks[itemId].scope.highlight();
                        scope.highlightedItem = itemId;
                    }
                }
            }
        }])
})();
