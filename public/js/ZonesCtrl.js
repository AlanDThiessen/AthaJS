/******************************************************************************
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Alan Thiessen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 ******************************************************************************/

(function() {
    'use strict';

    angular.module('Atha')
        .controller('ZonesCtrl', ZonesCtrl);

    ZonesCtrl.$inject = ['$scope', '$stateParams', 'FeathersJS'];
    function ZonesCtrl($scope, $stateParams, feathersSvc) {
        var zoneCtrl = this;
        zoneCtrl.newZoneName = '';
        zoneCtrl.zones = {};
        zoneCtrl.new = CreateZone;
        zoneCtrl.remove = RemoveZone;
        var zoneSvc = feathersSvc.getService('zones');
        var user = feathersSvc.getUser();
        var houseId = $stateParams.houseId;

        var query = {
            $limit: 20,
            $sort: {
                'name': 1
            }
        };

        if(typeof(houseId) != 'undefined') {
            query.houseId = houseId;
        }

        Start();

        return zoneCtrl;


        function Start() {
            $scope.$on('$destroy', Unsubscribe);
            zoneSvc.on('created', OnZoneCreated);
            zoneSvc.on('updated', OnZoneUpdated);
            zoneSvc.on('removed', OnZoneRemoved);
            GetZones();
        }


        function Unsubscribe() {
            zoneSvc.off('created', OnZoneCreated);
            zoneSvc.off('updated', OnZoneUpdated);
            zoneSvc.off('removed', OnZoneRemoved);
        }


        function GetZones() {
            zoneSvc.find({
                'query': query
            }).then(OnZonesUpdate, OnError);
        }


        function OnZonesUpdate(data) {
            zoneCtrl.zones = {};

            data.data.forEach(function(zone) {
                zoneCtrl.zones[zone._id] = zone;
            });

            $scope.$apply();
        }


        function OnZoneCreated(zone) {
            if(zone.userId == user._id) {
                if((typeof(houseId) != 'undefined') && (zone.houseId == houseId) ) {
                    zoneCtrl.zones[zone._id] = zone;
                    $scope.$apply();
                }
            }
        }


        function OnZoneUpdated(zone) {
            if(zoneCtrl.zones.hasOwnProperty(zone._id)) {
                zoneCtrl.zones[zone._id] = zone;
                $scope.$apply();
            }
        }


        function OnZoneRemoved(zone) {
            if(zoneCtrl.zones.hasOwnProperty(zone._id)) {
                delete(zoneCtrl.zones[zone._id]);
                $scope.$apply();
            }
        }


        function CreateZone() {
            var createObj = {
                'name': zoneCtrl.newZoneName
            };

            if(typeof(houseId) != 'undefined') {
                createObj.houseId = houseId;
            }

            zoneSvc.create(createObj).then(null, OnError);
        }


        function RemoveZone(zoneId) {
            zoneSvc.remove(zoneId).then(null, OnError);
        }


        function OnError(err) {
            console.log(err);
        }
    }

})();
