

angular.module('Atha', ['ui.router', 'FeathersJS'])
    .config(AthaConfig);

    AthaConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function AthaConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/LogIn.html',
                controller: 'StarterCtrl',
                controllerAs: 'starter'
            })

            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })

            .state('home.houses', {
                url: '/home/houses',
                views: {
                    'mainView': {
                        templateUrl: 'templates/houses.html'
                    }
                }
            });

            /*
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })

            // Each tab has its own nav history stack:

            .state('tab.settings', {
                url: '/settings',
                views: {
                    'tab-settings': {
                        templateUrl: 'templates/tab-settings.html',
                        controller: 'SettingsCtrl',
                        controllerAs: 'Settings'
                    }
                }
            })

            .state('tab.rooms', {
                url: '/rooms',
                views: {
                    'tab-rooms': {
                        templateUrl: 'templates/tab-rooms.html',
                        controller: 'RoomsCtrl',
                        controllerAs: 'Rooms'
                    }
                }
            })

            .state('tab.room-detail', {
                url: '/rooms/:roomId',
                views: {
                    'tab-rooms': {
                        templateUrl: 'templates/rooms-detail.html',
                        controller: 'RoomDetailsCtrl',
                        controllerAs: 'Lights'
                    }
                }
            });
            */

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    }
