'use strict';

const assert = require('assert');
const validateGroupUser = require('../../../../src/services/groupUsers/hooks/validateGroupUser.js');

describe('groupUsers validateGroupUser hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    validateGroupUser()(mockHook);

    assert.ok(mockHook.validateGroupUser);
  });
});
