'use strict';

const createAccount = require('./createAccount');

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const hooksCommon = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;

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
        hooksCommon.populate( {
            include: [ {
                service: 'accounts',
                nameAs: 'account',
                parentField: 'user_id',
                childField: 'userId',
                asArray: true
            }]
        }),
        hooksCommon.populate( {
            include: [ {
                service: 'groupUsers',
                nameAs: 'groups',
                parentField: 'user_id',
                childField: 'userId',
                asArray: true,
                query: {
                    $select: ['groupId']
                }
            }]
        })
    ],
    get: [
        hooksCommon.populate( {
            include: [ {
                service: 'accounts',
                nameAs: 'account',
                parentField: '_id',
                childField: 'userId',
                asArray: true
            }]
        }),
        hooksCommon.populate( {
            include: [ {
                service: 'groupUsers',
                nameAs: 'groups',
                parentField: '_id',
                childField: 'userId',
                asArray: true,
                query: {
                    $select: ['groupId']
                }
            }]
        })
    ],
    create: [
        createAccount()
    ],
    update: [],
    patch: [],
    remove: []
};
