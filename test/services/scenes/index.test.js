'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('scenes service', function() {
  it('registered the scenes service', () => {
    assert.ok(app.service('scenes'));
  });
});
