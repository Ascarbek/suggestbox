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
                    sbList: '@',
                    sbModel: '@',
                    sbMaxSelection: '=',
                    sbAllowDuplicates: '=',
                    sbAllowFreeText: '=',
                    sbAllowAddItem: '=',
                    sbNewItemField: '@',
                    sbSearchField: '@',
                    sbSelectFirstListItem: '=',
                    sbBroadcastEventName: '@',
                    sbSelectedListItemClass: '@',
                    sbCloseListOnSelect: '=',
                    sbOnSelectionChange: '&'
                },
                link: function(scope){
                    scope.init();
                },
                controller: ['$window', '$rootScope', '$scope', '$element', '$transclude', '$timeout', function($window, $rootScope, $scope, $element, $transclude, $timeout){

                    $scope.init = function() {
                        //$scope.isOpen = false; //shadow
                        if($scope.sbList === undefined){
                            throw "sb-list attribute must be set";
                        }
                        if($scope.sbModel === undefined){
                            throw "sb-model attribute must be set";
                        }
                        $scope.sbMaxSelection = $scope.sbMaxSelection || 0;
                        $scope.sbAllowDuplicates = $scope.sbAllowDuplicates || false;
                        $scope.sbAllowFreeText = $scope.sbAllowFreeText || false;
                        $scope.sbAllowAddItem = $scope.sbAllowAddItem || false;
                        $scope.sbNewItemField = $scope.sbNewItemField || 'name';
                        $scope.sbSearchField = $scope.sbSearchField || false;
                        $scope.sbSelectFirstListItem = $scope.sbSelectFirstListItem || false;
                        $scope.sbBroadcastEventName = $scope.sbBroadcastEventName || 'azSuggestBoxSelect';
                        $scope.sbSelectedListItemClass = $scope.sbSelectedListItemClass || 'ng-hide';
                        $scope.sbCloseListOnSelect = $scope.sbCloseListOnSelect || false;

                        $scope.weSentBroadcast = false;

                        //var match = $scope.sbList.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+)/);
                        var list, model, listAlias, modelAlias;

                        var listWords = $scope.sbList.split(' ');
                        if (listWords.length == 3) {
                            listAlias = listWords[0];
                            list = listWords[2];
                        }
                        else {
                            throw "invalid sbList attribute";
                        }

                        $scope.listAlias = listAlias;
                        $scope.list = $scope.$parent.$eval(list);

                        var modelWords = $scope.sbModel.split(' ');
                        if (modelWords.length == 3) {
                            modelAlias = modelWords[0];
                            model = modelWords[2];
                        }
                        else {
                            throw "invalid sbModel attribute";
                        }

                        $scope.modelAlias = modelAlias;
                        $scope.model = $scope.$parent.$eval(model);

                        $scope.closeDropDown = function(){
                            $scope.isOpen = false;
                        };

                        $scope.openDropDown = function(){
                            $scope.isOpen = true;
                        };

                        $scope.dropDownState = function(){
                            return $scope.isOpen;
                        };

                        $transclude($scope, function (clone, scope) {
                            scope.closeDropDown();
                            scope.$watch('isOpen', function(){
                                if(scope.isOpen){
                                    $element.addClass('open');
                                }
                                else{
                                    $element.removeClass('open');
                                }
                            });

                            $element.append(clone);
                        });

                        $scope.$watch('model', function () {
                            $scope.sbOnSelectionChange();
                            if($scope.sbCloseListOnSelect) {
                                $scope.closeDropDown();
                                $scope.$broadcast('clearSearch');
                            }

                            if(!$scope.sbAllowDuplicates) {
                                $scope.model.forEach(function (i) {
                                    $scope.selectListItem(i);
                                });
                            }
                        }, true);

                        $scope.$watch('list', function(){
                            //console.log('list - ', $scope.list);
                        }, true);

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

