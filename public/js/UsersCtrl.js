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
        .controller('UsersCtrl', UsersCtrl);

    UsersCtrl.$inject = ['$scope', '$state', '$stateParams', 'FeathersJS'];
    function UsersCtrl($scope, $state, $stateParams, feathersSvc) {
        var usersCtrl = this;
        usersCtrl.users = {};
        usersCtrl.remove = RemoveUser;
        usersCtrl.edit = EditUser;
        usersCtrl.new = NewUser;
        var usersSvc = feathersSvc.getService('users');
        var houseId = $stateParams.houseId;

        Start();

        return usersCtrl;


        function Start() {
            $scope.$on('$destroy', Unsubscribe);
            usersSvc.on('created', OnUserCreated);
            usersSvc.on('updated', OnUserUpdated);
            usersSvc.on('removed', OnUserRemoved);
            GetUsers();
        }


        function Unsubscribe() {
            usersSvc.off('created', OnUserCreated);
            usersSvc.off('updated', OnUserUpdated);
            usersSvc.off('removed', OnUserRemoved);
        }


        function GetUsers() {
            usersSvc.find({
                $limit: 100
            }).then(OnUsersUpdate, OnError);
        }


        function OnUsersUpdate(data) {
            usersCtrl.users = {};

            data.data.forEach(function(user) {
                usersCtrl.users[user._id] = user;
            });

            $scope.$apply();
        }


        function OnUserCreated(user) {
            usersCtrl.users[user._id] = user;
        }


        function OnUserUpdated(user) {
            if(usersCtrl.users.hasOwnProperty(user._id)) {
                usersCtrl.users[user._id] = user;
                $scope.$apply();
            }
        }


        function OnUserRemoved(user) {
            if(usersCtrl.users.hasOwnProperty(user._id)) {
                delete(usersCtrl.users[user._id]);
                $scope.$apply();
            }
        }


        function EditUser(userId) {
            $state.go('home.account', {
                'userId': userId,
                'houseId': houseId
            });
        }


        function NewUser() {
            $state.go('home.account', {
                'userId': 'create',
                'houseId': houseId
            });
        }


        function RemoveUser(id) {
            usersSvc.remove(id, {
                'accountId': usersCtrl.users[id].account.id
            }).then(null, OnError);
        }


        function OnError(err) {
            console.log(err);
        }
    }

})();
