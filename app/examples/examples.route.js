/**
 * Created by Ascarbek on 25.01.2016.
 */
(function(){
    'use strict';

    angular
        .module('demo')
        .run(['stateHelper', function(stateHelper) {
            stateHelper
                .addState('examples', {
                    url: '/examples',
                    title: 'examples',
                    views: {
                        main: {
                            templateUrl: 'app/examples/examples.page.html',
                            controller: 'examples as vm'
                        }
                    }
                });
        }]);
})();
