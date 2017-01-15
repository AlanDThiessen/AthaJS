
(function() {
    'use strict';

    angular.module('AthaHome', [])
        .factory('FeathersJS', FeathersClient)
        .factory('RoomSvc', RoomsService)
        .factory('LightSvc', LightSvc)
        .controller('Rooms', RoomsCtrl)
        .controller('Lights', LightsCtrl);


    FeathersClient.$inject = [];
    function FeathersClient() {
        var socket = io();
        var client = feathers()
            .configure(feathers.hooks())
            .configure(feathers.socketio(socket));

        return client;
    }


    RoomsService.$inject = ['FeathersJS'];
    function RoomsService(feathers) {
        return feathers.service('rooms');
    }


    LightSvc.$inject = ['FeathersJS'];
    function LightSvc(feathers) {
        return feathers.service('lights');
    }


    RoomsCtrl.$inject = ['$scope', 'RoomSvc'];
    function RoomsCtrl($scope, roomSvc) {
        var roomsCtrl = this;
        roomsCtrl.rooms = [];

        roomSvc.find({
            $limit: 100
        }).then(OnRoomsUpdate, OnError);

        return roomsCtrl;


        function OnRoomsUpdate(data) {
            roomsCtrl.rooms = [];

            data.data.forEach(function(room) {
                roomsCtrl.rooms.push(room);
            });

            $scope.$apply();
        }


        function OnError(err) {
            console.log(err);
        }
    }


    LightsCtrl.$inject = ['$scope', 'RoomSvc', 'LightSvc'];
    function LightsCtrl($scope, roomSvc, lightSvc) {
        var lightsCtrl = this;
        lightsCtrl.lights = [];
        var rooms = {};

        roomSvc.find({
            $limit: 100
        }).then(OnRoomsUpdate, OnError);

        return lightsCtrl;


        function OnRoomsUpdate(data) {
            rooms = [];

            data.data.forEach(function(room) {
                rooms[room._id] = room.name;
            });

            lightSvc.find({
                query: {
                    $limit: 100,
                    $sort: {
                        'address': 1
                    }
                }
                }).then(OnLightsUpdate, OnError);
        }


        function OnLightsUpdate(data) {
            lightsCtrl.lights = [];

            data.data.forEach(function(light) {
                light.roomName = rooms[light.roomId];
                lightsCtrl.lights.push(light);
            });

            $scope.$apply();
        }


        function OnError(err) {
            console.log(err);
        }
    }
})();
