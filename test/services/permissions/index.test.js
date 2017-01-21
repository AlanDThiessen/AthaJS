'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('permissions service', function() {
  it('registered the permissions service', () => {
    assert.ok(app.service('permissions'));
  });
});
