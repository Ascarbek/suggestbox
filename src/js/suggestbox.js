/**
 * Created by Ascarbek on 01.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('azSuggestBox')
        .directive('azSuggestBox', [ function(){
            return {
                transclude: true,
                restrict: 'AE',
                scope: {
                    listAlias: '@sbListItemAlias',
                    list: '=sbList',
                    indexesAlias: '@sbModelAlias',
                    model: '=sbModel',
                    indexes: '=sbSelectedIndexes',
                    sbMaxSelection: '=',
                    sbAllowDuplicates: '=',
                    sbAllowFreeText: '=',
                    sbAllowAddItem: '=',
                    sbNewItemField: '@',
                    sbSearchFields: '@',
                    sbSelectFirstListItem: '=',
                    sbBroadcastEventName: '@',
                    sbSelectedListItemClass: '@',
                    sbHighlightedListItemClass: '@',
                    sbCloseListOnSelect: '=',
                    sbOnSelectionChange: '&'
                },
                link: function(scope){
                    scope.init();
                },
                controller: ['$window', '$rootScope', '$scope', '$element', '$transclude', '$timeout', function($window, $rootScope, $scope, $element, $transclude, $timeout){

                    $scope.init = function() {
                        if($scope.list === undefined){
                            throw "sb-list attribute must be set";
                        }

                        $scope.listAlias = $scope.listAlias || 'i';
                        $scope.indexesAlias = $scope.indexesAlias || 's';
                        $scope.indexes = $scope.indexes || [];
                        $scope.model = $scope.model || [];
                        $scope.sbMaxSelection = $scope.sbMaxSelection || 0;
                        $scope.sbAllowDuplicates = $scope.sbAllowDuplicates || false;
                        $scope.sbAllowFreeText = $scope.sbAllowFreeText || false;
                        $scope.sbAllowAddItem = $scope.sbAllowAddItem || false;
                        $scope.sbNewItemField = $scope.sbNewItemField || 'name';
                        $scope.sbSearchFields = $scope.sbSearchFields || false;
                        $scope.sbSelectFirstListItem = $scope.sbSelectFirstListItem || false;
                        $scope.sbBroadcastEventName = $scope.sbBroadcastEventName || 'azSuggestBoxSelect';
                        $scope.sbSelectedListItemClass = $scope.sbSelectedListItemClass || 'ng-hide';
                        $scope.sbHighlightedListItemClass = $scope.sbHighlightedListItemClass || 'sb-list-item-highlight';
                        $scope.sbCloseListOnSelect = $scope.sbCloseListOnSelect || false;

                        $scope.weSentBroadcast = false;

                        $scope.closeDropDown = function(){
                            $scope.isOpen = false;
                        };

                        $scope.openDropDown = function(){
                            $scope.isOpen = true;
                        };

                        $scope.dropDownState = function(){
                            return $scope.isOpen;
                        };

                        $scope.closeDropDown();

                        $scope.$watch('isOpen', function(){
                            if($scope.isOpen){
                                $element.addClass('open');
                            }
                            else{
                                $element.removeClass('open');
                            }
                        });

                        $transclude($scope, function (clone, scope) {
                            $element.append(clone);
                        });

                        $scope.$watchCollection('list', function(){
                            for(var i=0; i<$scope.list.length; i++){
                                if(typeof $scope.list[i] != 'object'){
                                    throw 'sb-list array items should be objects';
                                }
                            }
                        });

                        $scope.$watchCollection('indexes', function () {
                            if($scope.sbCloseListOnSelect) {
                                $scope.closeDropDown();
                                $scope.highlightNone();
                                $scope.$broadcast('clearSearch');
                            }

                            if(!$scope.sbAllowDuplicates) {
                                for(var l=0; l<$scope.list.length; l++){
                                    $scope.unSelectListItem(l);
                                }
                                $scope.indexes.forEach(function (i) {
                                    $scope.selectListItem(i);
                                });
                            }

                            var left = [];
                            for (var m = 0; m < $scope.model.length; m++) {
                                if (typeof $scope.model[m].$listIndex == 'number') {
                                    if ($scope.indexes.indexOf($scope.model[m].$listIndex) == -1) {
                                        $scope.model.splice(m, 1);
                                        m--;
                                    }
                                    else{
                                        left[$scope.model[m].$listIndex] = true;
                                    }
                                }
                            }
                            for(var i=0; i<$scope.indexes.length; i++){
                                if(!left[$scope.indexes[i]]){
                                    $scope.model.push($scope.list[$scope.indexes[i]]);
                                    $scope.model[$scope.model.length-1].$listIndex = $scope.indexes[i];
                                }
                            }
                        });

                        $scope.$watchCollection('model', function(){
                            $scope.sbOnSelectionChange();

                            $scope.indexes.splice(0, $scope.indexes.length);
                            for(var m=0; m<$scope.model.length; m++) {
                                var found = false;
                                var foundIndex = -1;
                                for(var i=0; i<$scope.list.length; i++){
                                    var isEqual = true;
                                    var curItem = $scope.list[i];
                                    var curModel = $scope.model[m];
                                    for (var key in curItem) {
                                        if(curItem.hasOwnProperty(key)) {
                                            if (curItem[key] !== curModel[key]) {
                                                isEqual = false;
                                                break;
                                            }
                                        }
                                    }
                                    if(isEqual){
                                        found = true;
                                        foundIndex = i;
                                        break;
                                    }
                                }
                                if(found){
                                    $scope.model[m].$listIndex = foundIndex;
                                    $scope.indexes.push(foundIndex);
                                }
                                else{
                                    $scope.model[m].$isNew = true;
                                }
                            }
                        });

                        $window.onclick = function(e){
                            var el = e.target;
                            var isClickedOnSB = false;
                            do{
                                if(el.attributes){
                                    if((el.attributes['az-suggest-box'])||(el.attributes['sb-selection-item'])||(el.attributes['sb-trigger-area'])){
                                        isClickedOnSB = true;
                                        break;
                                    }
                                }
                                el = el.parentNode;

                            } while(el != undefined);
                            if(!isClickedOnSB){
                                $rootScope.$broadcast($scope.sbBroadcastEventName);
                            }
                        };

                        $scope.$on($scope.sbBroadcastEventName, function(){
                            if(!$scope.weSentBroadcast) {
                                $scope.closeDropDown();
                            }
                            $scope.weSentBroadcast = false;
                            $scope.$apply();
                        });
                    };
                }]
            }
        }
        ]);
})();

