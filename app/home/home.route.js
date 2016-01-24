/**
 * Created by Ascarbek on 25.01.2016.
 */
(function(){
    'use strict';

    angular
        .module('demo')
        .run(['stateHelper', function(stateHelper) {
            stateHelper
                .addState('home', {
                    url: '/',
                    title: 'home',
                    views: {
                        main: {
                            templateUrl: 'app/home/home.page.html',
                            controller: 'home as vm'
                        }
                    }
                });
        }]);
})();
