/**
 * Created by Ascarbek on 25.01.2016.
 */
(function(){
    'use strict';

    angular
        .module('demo', ['azSuggestBox'])
        .controller('home', ['$scope', function($scope){
            ga('set', 'page', '/Homepage');
            ga('send', 'pageview');

            var vm = this;

            vm.cities = [
                {
                    name: 'Beijing',
                    population: 20693000,
                    country: 'China'
                },{
                    name: 'Tokyo',
                    population: 13189000,
                    country: 'Japan'
                },{
                    name: 'Moscow',
                    population: 11541000,
                    country: 'Russia'
                },{
                    name: 'Seoul',
                    population: 10369593,
                    country: 'South Korea'
                },{
                    name: 'Jakarta',
                    population: 10187595,
                    country: 'Indonesia'
                },{
                    name: 'Mexico City',
                    population: 8851080,
                    country: 'Mexico'
                },{
                    name: 'London',
                    population: 8630100,
                    country: 'United Kingdom'
                },{
                    name: 'Lima',
                    population: 8481415,
                    country: 'Peru'
                },{
                    name: 'Bangkok',
                    population: 8249117,
                    country: 'Thailand'
                },{
                    name: 'Tehran',
                    population: 8154051,
                    country: 'Iran'
                },{
                    name: 'Bogotá',
                    population: 7438376,
                    country: 'Colombia'
                },{
                    name: 'Hong Kong',
                    population: 7298600,
                    country: 'Hong Kong (China)'
                }
            ];

            vm.model = [
                {
                    name: 'Tokyo',
                    population: 13189000,
                    country: 'Japan'
                },
                {
                    name: 'London',
                    population: 8630100,
                    country: 'United Kingdom'
                }
            ];
        }]);
})();
