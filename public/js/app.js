

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

            .state('home.account', {
                url: '/account/:userId/:houseId',
                cache: false,
                views: {
                    'mainView': {
                        templateUrl: 'templates/account.html',
                        controller: 'AccountCtrl',
                        controllerAs: 'account'
                    }
                }
            })

            .state('home.users', {
                url: '/users',
                views: {
                    'mainView': {
                        templateUrl: 'templates/users.html',
                        controller: 'UsersCtrl',
                        controllerAs: 'users'
                    }
                }
            })

            .state('home.houses', {
                url: '/houses',
                views: {
                    'mainView': {
                        templateUrl: 'templates/houses.html',
                        controller: 'HouseCtrl',
                        controllerAs: 'houses'
                    }
                }
            })

            .state('home.groups', {
                url: '/groups',
                views: {
                    'mainView': {
                        templateUrl: 'templates/groups.html',
                        controller: 'GroupsCtrl',
                        controllerAs: 'groups'
                    }
                }
            })

            .state('home.zones', {
                url: '/zones',
                views: {
                    'mainView': {
                        templateUrl: 'templates/zones.html',
                        controller: 'ZonesCtrl',
                        controllerAs: 'zones'
                    }
                }
            })

            .state('home.houseDetails', {
                url: '/houseDetails/:houseId',
                views: {
                    'mainView': {
                        templateUrl: 'templates/houseDetails.html',
                        controller: 'HouseDetailsCtrl',
                        controllerAs: 'house'
                    },
                    'houseGroups@home.houseDetails': {
                        templateUrl: 'templates/groups.html',
                        controller: 'GroupsCtrl',
                        controllerAs: 'groups'
                    },
                    'houseZones@home.houseDetails': {
                        templateUrl: 'templates/zones.html',
                        controller: 'ZonesCtrl',
                        controllerAs: 'zones'
                    },
                    'houseDevices@home.houseDetails': {
                        templateUrl: 'templates/devices.html',
                        controller: 'DevicesCtrl',
                        controllerAs: 'devices'
                    }
                }
            })
        ;

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
