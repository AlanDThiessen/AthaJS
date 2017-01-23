'use strict';

const assert = require('assert');
const createAccount = require('../../../../src/services/user/hooks/createAccount.js');

describe('user createAccount hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    createAccount()(mockHook);

    assert.ok(mockHook.createAccount);
  });
});
