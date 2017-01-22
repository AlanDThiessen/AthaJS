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

    angular.module('FeathersJS', [])
        .factory('FeathersJS', FeathersJSService);

    FeathersJSService.$inject = ['$state'];
    function FeathersJSService($state) {
        var feathersSvc = {
            connect: ServerConnect,
            login: Login,
            logout: Logout,
            getService: GetService,
            getUser: GetCurrentUser
        };

        var app;

        ServerConnect();

        return feathersSvc;

        function GetService(svcName) {
            if(typeof(app) != 'undefined') {
                return app.service(svcName);
            }
        }


        function GetCurrentUser() {
            return app.get('user');
        }


        function ServerConnect() {
            var socket = io('http://localhost:3030');
            app = feathers()
                .configure(feathers.hooks())
                .configure(feathers.socketio(socket))
                .configure(feathers.authentication({storage: window.localStorage}));

            app.authenticate().then(ConnectionSuccess, GotoLogin);

            app.on('reauthentication-error', GotoLogin);

            socket.io.engine.on('upgrade', function(transport) {
                console.log('transport changed');
                app.authenticate();
            });
        }


        function Login(email, password) {
            app.authenticate({
                'type': 'local',
                'email': email,
                'password': password
            }).then(ConnectionSuccess, GotoLogin);
        }


        function Logout() {
            app.logout().then(GotoLogin);
        }


        function ConnectionSuccess() {
            $state.go('home');
        }


        function GotoLogin(error) {
            $state.go('login');
        }
    }

})();

