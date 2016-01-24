/**
 * Created by Ascarbek on 25.01.2016.
 */
(function(){
    'use strict';

    angular
        .module('demo')
        .run(['stateHelper', function(stateHelper) {
            stateHelper
                .addState('documentation', {
                    url: '/documentation',
                    title: 'documentation',
                    views: {
                        main: {
                            templateUrl: 'app/documentation/documentation.page.html',
                            controller: 'documentation as vm'
                        }
                    }
                });
        }]);
})();
