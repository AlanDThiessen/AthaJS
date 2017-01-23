'use strict';

const createAccount = require('./createAccount');

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const hooksCommon = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;

const schema = {
    include: [
        {
            service: 'accounts',
            nameAs: 'account',
            parentField: '_id',
            childField: 'userId',
            asArray: false
        },
        {
            service: 'groupUsers',
            nameAs: 'groups',
            parentField: '_id',
            childField: 'userId',
            asArray: true,
            query: {
                $select: ['groupId']
            }
        }
    ]
};


exports.before = {
    all: [],
    find: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated()
    ],
    get: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        //auth.restrictToOwner({ ownerField: '_id' })
    ],
    create: [
        auth.hashPassword()
    ],
    update: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        auth.restrictToOwner({ ownerField: '_id' })
    ],
    patch: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        auth.restrictToOwner({ ownerField: '_id' })
    ],
    remove: [
        auth.verifyToken(),
        auth.populateUser(),
        auth.restrictToAuthenticated(),
        auth.restrictToOwner({ ownerField: '_id' })
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
        createAccount()
    ],
    update: [],
    patch: [],
    remove: []
};
