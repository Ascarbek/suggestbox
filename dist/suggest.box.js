/**
 * Created by Ascarbek on 01.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('azSuggestBox', []);
})();

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

/**
 * Created by Ascarbek on 02.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('azSuggestBox')
        .directive('sbRemoveItemFromSelection', [function(){
            return {
                restrict: 'AE',
                link: function(scope, element, attrs){
                    element.on('click', function(){
                        scope.sbRemoveItemFromSelection();
                        scope.$apply();
                    });
                }
            }
        }])
})();

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
                    sbOnSelectionChange: '&',
                    sbIsOpen: '@'
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


/**
 * Created by Ascarbek on 02.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('azSuggestBox')
        .directive('sbTriggerArea', [function(){
            return {
                restrict: 'AE',
                link: function(scope, element, attrs){
                    element.on('click', function(){
                        scope.sendBroadcast();

                        if(scope.dropDownState()){
                            scope.closeDropDown();
                        }
                        else{
                            scope.openDropDown();
                        }
                        scope.$apply();
                    });
                },
                controller: ['$rootScope', '$scope', function($rootScope, $scope){
                    $scope.sendBroadcast = function(){
                        $scope.weSentBroadcast = true;
                        $rootScope.$broadcast($scope.sbBroadcastEventName);
                    };
                }]
            }
        }])
})();

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
                                    if((scope.sbAllowFreeText)&&(element.val().length > 0)){
                                        var newObj = {};
                                        newObj[scope.sbNewItemField] = element.val();
                                        newObj['$isNew'] = true;

                                        if(scope.sbAllowAddItem){
                                            scope.list.splice(scope.list.length, 0, newObj);
                                            scope.toggleItemSelection(scope.list.length - 1);
                                        }
                                        else{
                                            scope.model.push(newObj);
                                        }
                                    }
                                    else{

                                    }
                                }

                                if(e.keyCode == 9){
                                    scope.closeDropDown();
                                    scope.highlightNone();
                                    scope.$broadcast('clearSearch');
                                }
                            }
                                break;

                            case 27:
                            {
                                scope.closeDropDown();
                                scope.$emit('clearSearch');
                                scope.highlightNone();
                                e.preventDefault();
                            }
                                break;

                            case 8:
                            {
                                //backspace
                                if ((element.val().length == 0)&&(scope.model.length>0)) {
                                    if(scope.model[scope.model.length-1].$isNew){
                                        scope.model.pop();
                                    }
                                    else {
                                        scope.unSelectListItem(scope.indexes.pop());
                                        scope.model.pop();
                                    }
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
                            scope.indexes.forEach(function (i) {
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
                            if(text.length == 0){   // show all if search is empty
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
                                                continue;
                                            }

                                            if(obj.search(new RegExp(text)) > -1){
                                                scope.showListItem(i);
                                                if(scope.indexes.indexOf(i) == -1) {
                                                    foundCount++;
                                                    lastId = i;
                                                }

                                                break;
                                            }
                                            else{
                                                scope.hideListItem(i);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if(!scope.sbAllowDuplicates) {
                            scope.indexes.forEach(function (i) { // hide selected items
                                scope.selectListItem(i);
                                if (lastId == i) {
                                    lastId = -1;
                                    foundCount = 2;
                                }
                            });
                        }

                        if(foundCount == 1){
                            scope.highlightListItem(lastId);  // highlight the only item
                        }
                    }
                }
            }
        }]);
})();
