/**
 * Created by Ascarbek on 25.01.2016.
 */
(function(){
    'use strict';

    angular
        .module('demo')
        .run(['stateHelper', function(stateHelper) {
            stateHelper
                .addState('tutorial', {
                    url: '/tutorial',
                    title: 'tutorial',
                    views: {
                        main: {
                            templateUrl: '/app/tutorial/tutorial.page.html',
                            controller: 'tutorial as vm'
                        }
                    }
                });
        }]);
})();
