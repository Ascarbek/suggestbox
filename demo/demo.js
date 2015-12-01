/**
 * Created by Ascarbek on 01.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('demo', ['azSuggestbox'])
        .controller('demo', [function(){
            this.items = [
                {id: 0, text: 'text1'},
                {id: 1, text: 'text2'},
                {id: 2, text: 'text3'}
            ]
        }]);
})();
