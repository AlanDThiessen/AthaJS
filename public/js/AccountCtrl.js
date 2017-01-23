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

    AccountCtrl.$inject = ['$scope', '$stateParams', 'FeathersJS'];
    function AccountCtrl($scope, $stateParams, feathersSvc) {
        var accountCtrl = this;
        accountCtrl.account = {};
        accountCtrl.update = UpdateAccount;
        var accountsSvc = feathersSvc.getService('accounts');
        var user = feathersSvc.getUser();
        var account = accountsSvc.find({
            'userId': user._id
        }).then(AccountRetrieved, OnError);

        Start();

        return accountCtrl;


        function Start() {
            $scope.$on('$destroy', Unsubscribe);
            //accountsSvc.on('created', OnGroupCreated);
            accountsSvc.on('updated', OnAccountUpdated);
            //accountsSvc.on('removed', OnGroupRemoved);
        }


        function Unsubscribe() {
            //accountsSvc.off('created', OnGroupCreated);
            accountsSvc.off('updated', OnAccountUpdated);
            //accountsSvc.off('removed', OnGroupRemoved);
        }


        function AccountRetrieved(data) {
            accountCtrl.account = data.data[0];
            $scope.$apply();
        }


        function OnAccountUpdated(account) {
            if(account.userId == user._id) {
                accountCtrl.account = account;
                $scope.$apply();
            }
        }


        function UpdateAccount() {
            var account = {};
            angular.copy(accountCtrl.account, account);
            var id = account._id;
            delete(account._id);
            accountsSvc.update(id, account).then(null, OnError);
        }


        function OnError(err) {
            console.log(err);
        }
    }

})();
