'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('groupUsers service', function() {
  it('registered the groupUsers service', () => {
    assert.ok(app.service('groupUsers'));
  });
});
