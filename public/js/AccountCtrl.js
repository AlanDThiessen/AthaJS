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
        .controller('AccountCtrl', AccountCtrl);

    AccountCtrl.$inject = ['$scope', '$state', '$stateParams', 'FeathersJS'];
    function AccountCtrl($scope, $state, $stateParams, feathersSvc) {
        var accountCtrl = this;
        accountCtrl.updateAccount = UpdateAccount;
        accountCtrl.updateInfo = UpdateInfo;
        accountCtrl.createUser = CreateUser;
        accountCtrl.addRole = AddRole;
        accountCtrl.changePass = {
            'oldPassword': '',
            'newPassword': '',
            'confirmPassword': ''
        };
        accountCtrl.error = '';
        accountCtrl.message = '';
        accountCtrl.msgStyle = {
            'color': 'black',
            'font-style': 'italic',
            'font-weight': 'bold'
        };
        accountCtrl.newRole = '';
        accountCtrl.function = '';
        accountCtrl.account = {};

        var usersSvc = feathersSvc.getService('users');
        var rolesSvc = feathersSvc.getService('roles');
        var thisUser = feathersSvc.getUser();

        if($stateParams.userId == "") {
            accountCtrl.function = 'current';
            angular.copy(thisUser, accountCtrl.account);
        }
        else if($stateParams.userId == 'create') {
            accountCtrl.function = 'create';
            accountCtrl.account = {
                'userId': thisUser._id,        // Associate with the current user
                'houseId': $stateParams.houseId,
                'email': '',
                'password': ''
            };
        }
        else if(typeof($stateParams.userId) != 'undefined') {
            accountCtrl.function = 'other';
            usersSvc.get($stateParams.userId).then(
                function(user) {
                    accountCtrl.account = user;
                    $scope.$apply();
                },
                OnUpdateError
            );
        }

        Start();

        return accountCtrl;


        function Start() {
            $scope.$on('$destroy', Unsubscribe);
            usersSvc.on('updated', OnAccountUpdated);
        }


        function Unsubscribe() {
            usersSvc.off('updated', OnAccountUpdated);
        }


        function OnAccountUpdated(user) {
            if(user._id == user._id) {
                accountCtrl.account = user;
                $scope.$apply();
            }
        }


        function UpdateUserSvc(id, account) {
            var updateAccount = {};

            angular.copy(account, updateAccount);

            if(updateAccount.hasOwnProperty('_id')) {
                delete(updateAccount._id);
            }

            usersSvc.patch(id, updateAccount).then(OnUpdateSuccess, OnUpdateError);
        }


        /**
         * @returns {boolean}
         */
        function ValidateNewPasswords() {
            var match = true;

            if(accountCtrl.changePass.newPassword != accountCtrl.changePass.confirmPassword) {
                match = false;
                accountCtrl.error = 'New passwords must match each other'
            }

            if(accountCtrl.changePass.newPassword == '') {
                match = false;
                accountCtrl.error = 'New password cannot be blank'
            }

            return match;
        }


        /**
         * @returns {boolean}
         */
        function ValidateOldPassword() {
            var valid = true;

            if(accountCtrl.changePass.oldPassword == '') {
                valid = false;
                accountCtrl.error = 'Old password cannot be blank';
            }

            return valid;
        }


        function UpdateAccount() {
            var valid = true;

            accountCtrl.error = '';

            if(accountCtrl.account.email == '') {
                valid = false;
                accountCtrl.error = 'Please type a valid email address';
            }
            else {
                valid = ValidateNewPasswords();
            }

            if(valid) {
                accountCtrl.account.password = accountCtrl.changePass.newPassword;
                UpdateUserSvc(accountCtrl.account._id, accountCtrl.account);
            }
        }


        function UpdateInfo() {
            accountCtrl.error = '';

            var acntToUpdate = {
                'name': accountCtrl.account.name
            };

            UpdateUserSvc(accountCtrl.account._id, acntToUpdate);
        }


        function CreateUser() {
            accountCtrl.error = '';
            accountCtrl.message = '';

            if(accountCtrl.account.email == '') {
                accountCtrl.error = 'Please type a valid email address';
            }
            else if(ValidateNewPasswords()) {
                accountCtrl.account.password = accountCtrl.changePass.newPassword;
                usersSvc.create(accountCtrl.account).then(OnCreateSuccess, OnUpdateError);
            }
        }


        function AddRole() {
            if(accountCtrl.newRole != '') {
                rolesSvc.create({
                    'userId': accountCtrl.account._id,
                    'role': accountCtrl.newRole
                }).then(RoleAdded, OnUpdateError);
            }

            accountCtrl.newRole = '';
        }


        function RoleAdded(data) {
            accountCtrl.account.roles.push(data.role);
        }


        function OnCreateSuccess() {
            $state.go('home.users');
        }

        function OnUpdateSuccess() {
            accountCtrl.message = 'Account updated successfully.';
            accountCtrl.msgStyle.color = 'green';
            $scope.$apply();
        }


        function OnUpdateError(err) {
            accountCtrl.message = 'Failed to update account.';
            accountCtrl.msgStyle.color = 'red';
            $scope.$apply();
            console.log(err);
        }
    }

})();
