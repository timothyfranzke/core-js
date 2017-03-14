coreApp.config(function($urlRouterProvider, $stateProvider) {

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/pages/home/home.html',
            controller: 'home.controller'
        });
    $urlRouterProvider.otherwise('/');
});