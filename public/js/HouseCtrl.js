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

    HouseCtrl.$inject = ['$scope', 'FeathersJS'];
    function HouseCtrl($scope, feathers) {
        var houseCtrl = this;
        houseCtrl.newHouseName = '';
        houseCtrl.houses = [];
        houseCtrl.new = CreateHouse;
        var houseSvc = feathers.getService('houses');
        GetHouses();

        return houseCtrl;


        function GetHouses() {
            houseSvc.find({
                $limit: 100
            }).then(OnHousesUpdate, OnError);
        }


        function OnHousesUpdate(data) {
            houseCtrl.houses = [];

            data.data.forEach(function(house) {
                houseCtrl.houses.push(house);
            });

            $scope.$apply();
        }


        function CreateHouse() {
            houseSvc.create({
                'name': houseCtrl.newHouseName
            });
        }


        function OnError(err) {
            console.log(err);
        }
    }

})();
