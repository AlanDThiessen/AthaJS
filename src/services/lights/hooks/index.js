'use strict';

const validateLight = require('./ValidateLight');

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;


exports.before = {
    all: [
        //auth.verifyToken(),
        //auth.populateUser(),
        //auth.restrictToAuthenticated()
    ],
    find: [],
    get: [],
    create: [validateLight()],
    update: [validateLight()],
    patch: [],
    remove: []
};

exports.after = {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
};
