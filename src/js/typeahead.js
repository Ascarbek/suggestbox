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
                link: function(scope, element, attrs, ctrl){

                    element.on('keydown', function(e){
                        switch (e.keyCode) {
                            case 40:
                            {
                                // down
                                scope.openDropDown();
                                scope.highlightNextItem();

                                e.preventDefault();
                            }
                                break;

                            case 38:
                            {
                                // up
                                scope.highlightPrevItem();

                                e.preventDefault();
                            }
                                break;

                            case 13:
                            case 9:
                            {
                                if (scope.highlightedItem > -1) {
                                    scope.toggleItemSelection(scope.highlightedItem);
                                }
                                else {
                                    if(scope.sbAllowFreeText){
                                        if(!scope.sbAllowAddItem) {
                                            scope.model.push(element.val());
                                        }
                                        else{

                                            var newObj = {};
                                            newObj[scope.sbNewItemField] = element.val();

                                            scope.list.splice(0, 0, newObj);

                                            if(scope.sbMaxSelection == 1){
                                                scope.model.splice(0, scope.model.length);
                                                scope.toggleItemSelection(0);
                                            }
                                            else {
                                                for (var m = 0; m < scope.model.length; m++) {
                                                    if (typeof scope.model[m] == 'number') {
                                                        scope.model[m]++;
                                                    }
                                                }
                                                scope.toggleItemSelection(0);
                                            }
                                        }
                                    }
                                    else{

                                    }
                                }
                                e.preventDefault();
                            }
                                break;

                            case 27:
                            {
                                scope.closeDropDown();
                                scope.$emit('clearSearch');
                                e.preventDefault();
                            }
                                break;

                            case 8:
                            {
                                //backspace
                                if (element.val().length == 0) {
                                    scope.unSelectListItem(scope.model.pop());
                                }
                            }
                                break;
                        }

                        scope.$apply();
                    });

                    element.on('input', function(){
                        performSearch();
                    });

                    scope.$on('clearSearch', function(){
                        element.val('');

                        for(var i=0; i<scope.list.length; i++){
                            scope.showListItem(i);
                        }
                        if(!scope.sbAllowDuplicates) {
                            scope.model.forEach(function (i) {
                                scope.selectListItem(i);
                            });
                        }
                    });

                    function performSearch(){
                        scope.openDropDown();

                        var text = element.val().toLowerCase();

                        var foundCount = 0, lastId = -1;

                        scope.highlightNone();

                        for(var i=0; i<scope.list.length; i++){
                            if(text.length == 0){
                                scope.showListItem(i);
                                foundCount++;
                                lastId = i;
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
                                                foundCount++;
                                                lastId = i;
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
                                        foundCount++;
                                        lastId = i;
                                        break;
                                    }
                                    else{
                                        scope.hideListItem(i);
                                    }
                                }
                                else if(typeof listItem == 'number'){
                                    if(listItem.toString().search(new RegExp(text)) > -1){
                                        scope.showListItem(i);
                                        foundCount++;
                                        lastId = i;
                                        break;
                                    }
                                    else{
                                        scope.hideListItem(i);
                                    }
                                }
                            }
                        }

                        if(!scope.sbAllowDuplicates) {
                            scope.model.forEach(function (i) {
                                scope.selectListItem(i);
                                if (lastId == i) {
                                    lastId = -1;
                                    foundCount = 2;
                                }
                            });
                        }

                        if(foundCount == 1){
                            scope.highlightListItem(lastId);
                        }
                    }
                }
            }
        }]);
})();