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
                    sbMaxSelection: '@',
                    sbAllowFreeText: '@',
                    sbAllowAddItem: '@',
                    sbBroadcastEventName: '@',
                    sbCloseListOnSelect: '@'
                },
                link: function(scope, element, attrs, ctrl, transclude){
                    scope.init();
                },
                controller: ['$scope', '$element', '$transclude', '$timeout', function($scope, $element, $transclude, $timeout){

                    $scope.init = function() {
                        $scope.isOpen = false;

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
                        $scope.$watch('list', function(){
                            //console.log('list - ', $scope.list);
                        }, true);

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
                        $scope.$watch('model', function () {
                            //console.log('model - ', $scope.model);
                        }, true);

                        $transclude($scope.$new(), function (clone, scope) {
                            $element.append(clone);
                        });

                    };
                }]
            }
        }
    ]);
})();

