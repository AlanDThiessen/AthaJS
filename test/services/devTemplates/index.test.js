'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('devTemplates service', function() {
  it('registered the devTemplates service', () => {
    assert.ok(app.service('devTemplates'));
  });
});
