'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const hooksCommon = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;

const schema = {
    include: [
        {
            service: 'groupUsers',
            nameAs: 'groups',
            parentField: '_id',
            childField: 'userId',
            asArray: true,
            query: {
                $select: ['groupId']
            }
        },
        {
            service: 'roles',
            nameAs: 'roles',
            parentField: '_id',
            childField: 'userId',
            asArray: true,
            query: {
                $limit: 5,
                $select: ['role']
            }
        }
    ]
};


exports.before = {
    all: [],
    find: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        globalHooks.adminOrOwnedBy()
    ],
    get: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated()
        //auth.restrictToOwner({ ownerField: '_id' })
    ],
    create: [
        auth.hashPassword()
    ],
    update: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        auth.hashPassword(),
        globalHooks.adminOrOwnedBy(),
        hooksCommon.dePopulate()
    ],
    patch: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        auth.hashPassword(),
        globalHooks.adminOrOwnedBy(),
        hooksCommon.dePopulate()
    ],
    remove: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        globalHooks.adminOrOwnedBy()
    ]
};

exports.after = {
    all: [
        hooks.remove('password')
    ],
    find: [
        hooksCommon.populate( { schema } )
    ],
    get: [
        hooksCommon.populate( { schema } )
    ],
    create: [
    ],
    update: [],
    patch: [],
    remove: []
};
