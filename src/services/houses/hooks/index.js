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
        globalHooks.adminOrOwner()
    ],
    get: [
        globalHooks.adminOrOwner()
    ],
    create: [
        auth.associateCurrentUser()
    ],
    update: [
        globalHooks.adminOrOwner()
    ],
    patch: [
        globalHooks.adminOrOwner()
    ],
    remove: [
        auth.restrictToOwner({ ownerField: 'userId' })
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
