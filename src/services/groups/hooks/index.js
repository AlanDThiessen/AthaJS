'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

exports.before = {
    all: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated()
    ],
    find: [
        globalHooks.adminOrOwnedBy()
    ],
    get: [
        globalHooks.adminOrOwnedBy()
    ],
    create: [
        auth.associateCurrentUser()
    ],
    update: [
        globalHooks.adminOrOwnedBy()
    ],
    patch: [
        globalHooks.adminOrOwnedBy()
    ],
    remove: [
        globalHooks.adminOrOwnedBy()
    ]
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
