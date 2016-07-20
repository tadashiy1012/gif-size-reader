module.exports = (function() {
  const fs = require('fs');
  
  const SIGNATURE_IDX = 0;
  const SIGNATURE_SIZE = 3;
  const VERSION_IDX = 3;
  const VERSION_SIZE = 3;
  const SCREEN_WIDTH_IDX = 6;
  const SCREEN_WIDTH_SIZE = SCREEN_WIDTH_IDX + 2;
  const SCREEN_HEIGHT_IDX = 8;
  const SCREEN_HEIGHT_SIZE = SCREEN_HEIGHT_IDX + 2;
  const GIF_SIGNATURE = [0x47, 0x49, 0x46];
  const GIF_VERSIONS = [[0x38, 0x39, 0x61]];

  function getHexStr(bary) {
    let line = '';
    for (let i = 0; i < bary.length; i++) {
      const s = bary[i].toString(16);
      if (s.length < 2) {
        line += ('0' + s);
      } else {
        line += s;
      }
    }
    return line;
  }

  function readBuf(tgtImagePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(tgtImagePath, (err, data) => {
        if (err) { reject(err); }
        else { resolve(new Uint8Array(data)); }
      });
    });
  }

  function comp(intary, hexary) {
    return intary.toString() === hexary.toString();
  }

  function check(bary) {
    const b = bary.subarray(0, SIGNATURE_SIZE);
    return comp(b, GIF_SIGNATURE);
  }

  function getSize(bary) {
    const bw = bary.subarray(SCREEN_WIDTH_IDX, SCREEN_WIDTH_SIZE);
    const bh = bary.subarray(SCREEN_HEIGHT_IDX, SCREEN_HEIGHT_SIZE);
    const hw = getHexStr(bw.reverse());
    const hh = getHexStr(bh.reverse());
    return [parseInt(hw, 16), parseInt(hh, 16)];
  }

  return function gifSizeReader(tgtFilePath) {
    return new Promise((resolve, reject) => {
      readBuf(tgtFilePath).then((resp) => {
        if (check(resp)) {
          resolve(getSize(resp));
        } else {
          reject(new Error('Unsupported file type'));
        }
      }).catch((err) => {
        console.log(err);
        reject(err);
      })
    });
  };
})();