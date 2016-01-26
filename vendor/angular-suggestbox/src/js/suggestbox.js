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
                    modelAlias: '@sbModelAlias',
                    model: '=sbModel',
                    indexes: '=sbSelectedIndexes',
                    sbMaxSelection: '=',
                    sbAllowDuplicates: '=',
                    sbAllowFreeText: '=',
                    sbAllowAddItem: '=',
                    sbNewItemField: '@',
                    sbSearchFieldsRaw: '@sbSearchFields',
                    sbKeyFieldsRaw: '@sbKeyFields',
                    sbSelectFirstListItem: '=',
                    sbBroadcastEventName: '@',
                    sbSelectedListItemClass: '@',
                    sbHighlightedListItemClass: '@',
                    sbCloseListOnSelect: '=',
                    sbOnSelectionChange: '&',
                    sbIsOpen: '@'
                },
                link: function(scope){
                    scope.init();
                },
                controller: ['$document', '$rootScope', '$scope', '$element', '$transclude', '$timeout', function($document, $rootScope, $scope, $element, $transclude, $timeout){

                    $scope.init = function() {
                        /*
                        * Required attribute
                        * */
                        if($scope.list === undefined){
                            throw "sb-list attribute must be set";
                        }

                        /*
                        * Default values
                        * */
                        $scope.listAlias = $scope.listAlias || 'i';
                        $scope.modelAlias = $scope.modelAlias || 's';
                        $scope.indexes = $scope.indexes || [];
                        $scope.model = $scope.model || [];
                        $scope.sbMaxSelection = $scope.sbMaxSelection || 0;
                        $scope.sbAllowDuplicates = $scope.sbAllowDuplicates || false;
                        $scope.sbAllowFreeText = $scope.sbAllowFreeText || false;
                        $scope.sbAllowAddItem = $scope.sbAllowAddItem || false;
                        $scope.sbNewItemField = $scope.sbNewItemField || 'name';
                        $scope.sbSearchFieldsRaw = $scope.sbSearchFieldsRaw || false;
                        $scope.sbKeyFieldsRaw = $scope.sbKeyFieldsRaw || false;
                        $scope.sbSelectFirstListItem = $scope.sbSelectFirstListItem || false;
                        $scope.sbBroadcastEventName = $scope.sbBroadcastEventName || 'azSuggestBoxSelect';
                        $scope.sbSelectedListItemClass = $scope.sbSelectedListItemClass || 'ng-hide';
                        $scope.sbHighlightedListItemClass = $scope.sbHighlightedListItemClass || 'sb-list-item-highlight';
                        $scope.sbCloseListOnSelect = $scope.sbCloseListOnSelect || false;

                        $scope.weSentBroadcast = false;

                        /*
                        * transforming space separated list to array
                        * */
                        if($scope.sbKeyFieldsRaw){
                            $scope.sbKeyFields = $scope.sbKeyFieldsRaw.split(' ');
                            // validation required
                        }
                        else{
                            $scope.sbKeyFields = [];
                        }

                        if($scope.sbSearchFieldsRaw){
                            $scope.sbSearchFields = $scope.sbSearchFieldsRaw.split(' ');
                        }
                        else{
                            $scope.sbSearchFields = [];
                        }

                        /*
                        * dropdown state get/setters
                        * */
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
                        if($scope.sbIsOpen){
                            $scope.openDropDown();
                        }

                        $scope.$watch('isOpen', function(){
                            if($scope.isOpen){
                                $element.addClass('open');
                            }
                            else{
                                $element.removeClass('open');
                            }
                        });

                        /*
                        * inserting html layout as is
                        * */
                        $transclude($scope, function (clone, scope) {
                            $element.append(clone);
                        });

                        $scope.$watchCollection('list', function(){
                            for(var i=0; i<$scope.list.length; i++){
                                if(typeof $scope.list[i] != 'object'){
                                    throw 'sb-list array items should be objects';
                                }
                            }
                            /*
                            * if key or search fields are not specified then using all fields from sb-list array
                            * */
                            if($scope.sbKeyFields.length == 0){
                                if($scope.list.length > 0) {
                                    for (var key in $scope.list[0]) {           //using first element
                                        if($scope.list[0].hasOwnProperty(key))
                                            $scope.sbKeyFields.push(key);
                                    }
                                }
                            }
                            if($scope.sbSearchFields.length == 0){
                                if($scope.list.length > 0) {
                                    for (var key in $scope.list[0]) {
                                        if($scope.list[0].hasOwnProperty(key))
                                            $scope.sbSearchFields.push(key);
                                    }
                                }
                            }
                        });

                        $scope.$watchCollection('indexes', function () {
                            if(!$scope.sbAllowDuplicates) {
                                for(var l=0; l<$scope.list.length; l++){
                                    $scope.unSelectListItem(l);
                                }
                                $scope.indexes.forEach(function (i) {
                                    $scope.selectListItem(i);
                                });
                            }

                            /*
                            * synchronizing model and indexes
                            * */
                            var left = [];
                            for (var m = 0; m < $scope.model.length; m++) {
                                if (typeof $scope.model[m].$listIndex == 'number') {
                                    if ($scope.indexes.indexOf($scope.model[m].$listIndex) == -1) {
                                        $scope.model.splice(m, 1);                 // removing not found model element
                                        m--;
                                    }
                                    else{
                                        left[$scope.model[m].$listIndex] = true;   // marking existing element
                                    }
                                }
                            }
                            for(var i=0; i<$scope.indexes.length; i++){
                                if(!left[$scope.indexes[i]]){
                                    $scope.model.push($scope.list[$scope.indexes[i]]);                    // adding not existing element
                                    $scope.model[$scope.model.length-1].$listIndex = $scope.indexes[i];
                                }
                            }
                        });

                        $scope.$watchCollection('model', function(){
                            $scope.sbOnSelectionChange();

                            /*
                             * synchronizing model and indexes
                             * */
                            var left = [];
                            for (var i = 0; i < $scope.indexes.length; i++){
                                var foundIndex = -1;
                                for(var im = 0; im < $scope.model.length; im++){
                                    var isEqual = true;
                                    $scope.sbKeyFields.forEach(function(kf){
                                        if($scope.list[$scope.indexes[i]][kf] != $scope.model[im][kf]){
                                            isEqual = false;
                                        }
                                    });
                                    if(isEqual){
                                        foundIndex = im;
                                        break;
                                    }
                                }
                                if(foundIndex == -1){
                                    $scope.indexes.splice(i, 1);      // removing not found model element
                                    i--;
                                }
                                else{
                                    left[foundIndex] = true;          // marking existing element
                                }
                            }
                            for (var m = 0; m < $scope.model.length; m++) {
                                if(!left[m]){
                                    if($scope.model[m].$listIndex) {
                                        $scope.indexes.push($scope.model[m].$listIndex);   // adding not existing element using $listIndex
                                    }
                                    else{                                                  // if there is no $listIndex then need to search throw main list
                                        var foundIndex = -1;
                                        for (var l = 0; l < $scope.list.length; l++) {
                                            var isEqual = true;
                                            var curItem = $scope.list[l];
                                            var curModel = $scope.model[m];
                                            $scope.sbKeyFields.forEach(function(kf){
                                                if(curItem[kf] != curModel[kf]){
                                                    isEqual = false;
                                                }
                                            });
                                            if(isEqual){
                                                foundIndex = l;
                                                break;
                                            }
                                        }
                                        if(foundIndex > -1){
                                            $scope.model[m].$listIndex = foundIndex;               // add $listIndex field for future use
                                            $scope.indexes.push(foundIndex);
                                        }
                                        else{
                                            $scope.model[m].$isNew = true;
                                        }
                                    }
                                }
                            }
                        });

                        $document.on('click',function(e){               // handler to close SuggestBox on document click
                            var el = e.target;
                            var isClickedOnSB = false;
                            do{
                                if(el.attributes){
                                    if((el.attributes['az-suggest-box'])||(el.attributes['sb-selection-item'])||(el.attributes['sb-trigger-area'])){  // if clicked inside the SuggestBox then no need to interfere
                                        isClickedOnSB = true;
                                        break;
                                    }
                                }
                                el = el.parentNode;

                            } while(el != undefined);
                            if(!isClickedOnSB){  // if clicked outside the SuggestBox then send close msg
                                $rootScope.$broadcast($scope.sbBroadcastEventName);
                            }
                        });

                        $scope.$on($scope.sbBroadcastEventName, function(){      // handling close msg
                            if(!$scope.weSentBroadcast) {                        // close other dropdowns on the page except us
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

