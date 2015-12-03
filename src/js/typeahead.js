/**
 * Created by Ascarbek on 02.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('azSuggestBox')
        .directive('sbTypeAhead', [function(){
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ctrl){
                    element.on('keydown', function(e){
                        switch (e.keyCode){
                            case 40: {
                                // down
                                scope.isOpen = true;
                                scope.highlightNextItem();

                                e.preventDefault();
                            } break;

                            case 38: {
                                // up
                                scope.highlightPrevItem();

                                e.preventDefault();
                            } break;

                            case 13: {
                                if(scope.highlightedItem > -1){
                                    scope.model.push(scope.list[scope.highlightedItem]);
                                }
                                e.preventDefault();
                            } break;

                            case 27: {
                                scope.isOpen = false;
                                scope[attrs.ngModel] = '';
                                e.preventDefault();
                            } break;

                            case 8: {
                                //backspace
                                if(scope[attrs.ngModel].length == 0){
                                    scope.model.pop();
                                }
                            } break;
                        }
                        scope.$apply();
                    });

                    scope.$on('clearSearch', function(){
                        scope[attrs.ngModel] = '';
                        for(var i=0; i<scope.list.length; i++){
                            scope.showListItem(i);
                        }
                    });

                    ctrl.$viewChangeListeners.push(function() {
                        scope.isOpen = true;

                        var text = scope[attrs.ngModel].toLowerCase();

                        var foundItems = [];
                        for(var i=0; i<scope.list.length; i++){
                            if(text.length == 0){
                                scope.showListItem(i);
                                foundItems.push(i);
                            }
                            else{
                                var listItem = scope.list[i];
                                if(typeof listItem == 'object') {
                                    for (var key in listItem) {
                                        if(listItem.hasOwnProperty(key)) {
                                            var obj;
                                            if(typeof listItem[key] == 'string') {
                                                obj = listItem[key].toLowerCase();
                                            }
                                            else if(typeof listItem[key] == 'number'){
                                                obj = listItem[key].toString();
                                            }
                                            else{
                                                break;
                                            }

                                            if(obj.search(new RegExp(text)) > -1){
                                                scope.showListItem(i);
                                                foundItems.push(i);
                                                break;
                                            }
                                            else{
                                                scope.hideListItem(i);
                                            }
                                        }
                                    }
                                }
                                else if(typeof listItem == 'string'){
                                    if(listItem.toLowerCase().search(new RegExp(text)) > -1){
                                        scope.showListItem(i);
                                        foundItems.push(i);
                                        break;
                                    }
                                    else{
                                        scope.hideListItem(i);
                                    }
                                }
                                else if(typeof listItem == 'number'){
                                    if(listItem.toString().search(new RegExp(text)) > -1){
                                        scope.showListItem(i);
                                        foundItems.push(i);
                                        break;
                                    }
                                    else{
                                        scope.hideListItem(i);
                                    }
                                }
                            }
                        }
                        if(foundItems.length == 1){
                            scope.highlightListItem(foundItems[0]);
                        }
                    });
                }
            }
        }]);
})();
