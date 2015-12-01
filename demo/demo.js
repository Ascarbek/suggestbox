/**
 * Created by Ascarbek on 01.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('demo', ['azSuggestBox'])
        .controller('demo', ['$scope', function($scope){
            this.items = [
                {id: 0, text: 'text1'},
                {id: 1, text: 'text2'},
                {id: 2, text: 'text3'}
            ];

            this.selectedItem = [
                {id: 4, text: 'text5'}
            ];

            this.changeSmth = function(){
                this.selectedItem.push(this.items[0]);
                this.items.push({id: 3, text: 'text4'});
                //$scope.$apply();
            };

        }]);
})();
