
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
        roomsCtrl.removeRoom = RemoveRoom;
        roomsCtrl.rooms = [];

        UpdateRooms();

        return roomsCtrl;


        function UpdateRooms() {
            roomSvc.find({
                $limit: 100
            }).then(OnRoomsUpdate, OnError);
        }


        function OnRoomsUpdate(data) {
            roomsCtrl.rooms = [];

            data.data.forEach(function(room) {
                roomsCtrl.rooms.push(room);
            });

            $scope.$apply();
        }


        function RemoveRoom(id) {
            roomSvc.remove(id).then(UpdateRooms, OnError);
        }


        function OnError(err) {
            console.log(err);
        }
    }


    LightsCtrl.$inject = ['$scope', 'RoomSvc', 'LightSvc'];
    function LightsCtrl($scope, roomSvc, lightSvc) {
        var lightsCtrl = this;
        lightsCtrl.lights = [];
        lightsCtrl.removeLight = RemoveLight;
        var rooms = {};

        UpdateRooms();

        return lightsCtrl;


        function UpdateRooms() {
            roomSvc.find({
                $limit: 100
            }).then(OnRoomsUpdate, OnError);
        }

        function OnRoomsUpdate(data) {
            rooms = [];

            data.data.forEach(function(room) {
                rooms[room._id] = room.name;
            });

            UpdateLights();
        }


        function UpdateLights() {
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


        function RemoveLight(id) {
            lightSvc.remove(id).then(UpdateLights, OnError);
        }


        function OnError(err) {
            console.log(err);
        }
    }
})();
