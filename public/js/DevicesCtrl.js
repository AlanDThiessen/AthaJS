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
        .controller('DevicesCtrl', Devices);

    Devices.$inject = ['$scope', '$state', '$stateParams', 'FeathersJS'];
    function Devices($scope, $state, $stateParams, feathersSvc) {
        var devicesCtrl = this;
        devicesCtrl.newDeviceName = '';
        devicesCtrl.devices = {};
        devicesCtrl.zones = [];
        devicesCtrl.new = CreateDevice;
        devicesCtrl.edit = EditDevice;
        devicesCtrl.remove = RemoveDevice;
        devicesCtrl.selectZone = DeviceZoneSelected;
        devicesCtrl.saveDeviceName = SaveDeviceName;
        var devicesSvc = feathersSvc.getService('devices');
        var zonesSvc = feathersSvc.getService('zones');
        var user = feathersSvc.getUser();
        var houseId = $stateParams.houseId;

        var query = {
            $limit: 100,
            $sort: {
                'name': 1
            }
        };

        Start();

        return devicesCtrl;


        function Start() {
            $scope.$on('$destroy', Unsubscribe);
            devicesSvc.on('created', OnDeviceCreated);
            devicesSvc.on('updated', OnDeviceUpdated);
            devicesSvc.on('removed', OnDeviceRemoved);
            zonesSvc.on('created', OnZoneCreated);
            zonesSvc.on('removed', OnZoneRemoved);
            GetZones();
            GetDevices();
        }


        function Unsubscribe() {
            devicesSvc.off('created', OnDeviceCreated);
            devicesSvc.off('updated', OnDeviceUpdated);
            devicesSvc.off('removed', OnDeviceRemoved);
            zonesSvc.off('created', OnZoneCreated);
            zonesSvc.off('removed', OnZoneRemoved);
        }


        function GetDevices() {
            if(typeof(houseId) != 'undefiend') {
                query['houseId'] = houseId;
            }

            devicesSvc.find({
                'query': query
            }).then(OnDevicesUpdate, OnError);
        }


        function GetZones() {
            if(typeof(houseId) != 'undefiend') {
                query['houseId'] = houseId;
            }

            zonesSvc.find({
                'query': query
            }).then(OnZonesUpdate, OnError);
        }


        function OnDevicesUpdate(data) {
            devicesCtrl.devices = {};

            data.data.forEach(function(device) {
                if(typeof(device.zoneId) == 'undefined') {
                    device.zoneId = null;
                }

                devicesCtrl.devices[device._id] = device;
            });

            $scope.$apply();
        }


        function OnZonesUpdate(data) {
            devicesCtrl.zones = [];

            data.data.forEach(function(zone) {
                devicesCtrl.zones.push(zone);
            });

            $scope.$apply();
        }


        function OnDeviceCreated(device) {
            if(device.userId == user._id) {
                devicesCtrl.devices[device._id] = device;
                $scope.$apply();
            }
        }


        function OnDeviceUpdated(device) {
            if(devicesCtrl.devices.hasOwnProperty(device._id)) {
                devicesCtrl.devices[device._id] = device;
                $scope.$apply();
            }
        }


        function OnDeviceRemoved(device) {
            if(devicesCtrl.devices.hasOwnProperty(device._id)) {
                delete(devicesCtrl.devices[device._id]);
                $scope.$apply();
            }
        }


        function CreateDevice() {
            var createObj = {
                'name': devicesCtrl.newDeviceName
            };

            if(typeof(houseId) != 'undefined') {
                createObj.houseId = houseId;
            }

            devicesSvc.create(createObj).then(null, OnError);
        }


        function RemoveDevice(deviceId) {
            devicesSvc.remove(deviceId).then(null, OnError);
        }


        function EditDevice(deviceId) {
            $state.go('home.houseDevices', {
                'deviceId': deviceId
            });
        }


        function UpdateDeviceZone(deviceId) {
            var updateDevice = {
                'zoneId': devicesCtrl.devices[deviceId].zoneId
            };

            devicesSvc.patch(deviceId, updateDevice).then(OnDeviceUpdated, OnError);
        }


        function OnZoneCreated(zone) {
            if(zone.houseId == houseId) {
                devicesCtrl.zones.push(zone);
                $scope.$apply();
            }
        }


        function OnZoneRemoved(zone) {
            var index = devicesCtrl.zones.findIndex(function(zoneIt) {
                if(zoneIt._id == zone._id) {
                    return true;
                }
                else {
                    return false;
                }
            });

            if(index != -1) {
                devicesCtrl.zones.splice(index, 1);
                RemoveZoneFromDevices(zone._id);
            }
        }


        function RemoveZoneFromDevices(zoneId) {
            for(var deviceId in devicesCtrl.devices) {
                if(devicesCtrl.devices.hasOwnProperty(deviceId)) {
                    if(devicesCtrl.devices[deviceId].zoneId == zoneId) {
                        devicesCtrl.devices[deviceId].zonId = null;
                        UpdateDeviceZone(deviceId);
                    }
                }
            }

            $scope.$apply();
        }


        function DeviceZoneSelected(deviceId) {
            UpdateDeviceZone(deviceId);
        }


        function SaveDeviceName(newValue, id) {
            devicesSvc.patch(id, {
                'name': newValue
            }).then(OnDeviceUpdated, OnError);
        }


        function OnError(err) {
            console.log(err);
        }
    }

})();
