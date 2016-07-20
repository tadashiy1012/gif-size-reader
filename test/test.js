const path = require('path');
const assert = require('power-assert');
const reader = require('../index.js');

describe('gif-size-reader test', () => {
  const testDir = path.join(__dirname, 'test_images');
  const testImage = path.join(testDir, 'test_gif_image.gif');
  it('test1', (done) => {
    reader(testImage).then((resp) => {
      assert(resp.toString() === [613, 473].toString());
      done();
    });
  });
});