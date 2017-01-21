'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('zones service', function() {
  it('registered the zones service', () => {
    assert.ok(app.service('zones'));
  });
});
