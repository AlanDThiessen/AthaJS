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
        .controller('HouseCtrl', HouseCtrl);

    HouseCtrl.$inject = ['$scope', '$state', 'FeathersJS'];
    function HouseCtrl($scope, $state, feathersSvc) {
        var houseCtrl = this;
        houseCtrl.newHouseName = '';
        houseCtrl.houses = {};
        houseCtrl.new = CreateHouse;
        houseCtrl.edit = EditHouse;
        houseCtrl.remove = RemoveHouse;
        houseCtrl.saveHouseName = SaveHouseName;
        var houseSvc = feathersSvc.getService('houses');
        var user = feathersSvc.getUser();

        Start();

        return houseCtrl;


        function Start() {
            $scope.$on('$destroy', Unsubscribe);
            houseSvc.on('created', OnHouseCreated);
            houseSvc.on('updated', OnHouseUpdated);
            houseSvc.on('removed', OnHouseRemoved);
            GetHouses();
        }


        function Unsubscribe() {
            houseSvc.off('created', OnHouseCreated);
            houseSvc.off('updated', OnHouseUpdated);
            houseSvc.off('removed', OnHouseRemoved);
        }


        function GetHouses() {
            houseSvc.find({
                $limit: 100,
                query: {
                    $sort: {
                        'name': 1
                    }
                }
            }).then(OnHousesUpdate, OnError);
        }


        function OnHousesUpdate(data) {
            houseCtrl.houses = {};

            data.data.forEach(function(house) {
                houseCtrl.houses[house._id] = house;
            });

            $scope.$apply();
        }


        function OnHouseCreated(house) {
            if(house.userId == user._id) {
                houseCtrl.houses[house._id] = house;
                $scope.$apply();
            }
        }


        function OnHouseUpdated(house) {
            if(houseCtrl.houses.hasOwnProperty(house._id)) {
                houseCtrl.houses[house._id] = house;
                $scope.$apply();
            }
        }


        function OnHouseRemoved(house) {
            if(houseCtrl.houses.hasOwnProperty(house._id)) {
                delete(houseCtrl.houses[house._id]);
                $scope.$apply();
            }
        }


        function CreateHouse() {
            houseSvc.create({
                'name': houseCtrl.newHouseName
            });
        }


        function RemoveHouse(houseId) {
            houseSvc.remove(houseId).then(null, OnError);
        }


        function EditHouse(houseId) {
            $state.go('home.houseDetails', {
                'houseId': houseId
            });
        }


        function SaveHouseName(newValue, id) {
            houseSvc.patch(id, {
                'name': newValue
            }).then(OnHouseUpdated, OnError);
        }


        function OnError(err) {
            console.log(err);
        }
    }

})();
