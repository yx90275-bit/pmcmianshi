var fs = require('fs');

function createMinimalPNG(size, r, g, b) {
  // 最小有效 PNG - 纯色背景 + 圆形
  var signature = Buffer.from([137, 80, 78, 13, 10, 26, 10]);
  
  // IHDR chunk
  var ihdr_data = Buffer.alloc(13);
  ihdr_data.writeUInt32BE(size, 0);  // width
  ihdr_data.writeUInt32BE(size, 4);  // height
  ihdr_data[8] = 8;   // bit depth
  ihdr_data[9] = 2;   // color type (RGB)
  ihdr_data[10] = 0;  // compression
  ihdr_data[11] = 0;  // filter
  ihdr_data[12] = 0;  // interlace
  
  function crc32(buf) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (var j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xEDB88320 : 0);
      }
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  
  function makeChunk(type, data) {
    var len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    var typeAndData = Buffer.concat([Buffer.from(type), data]);
    var crcVal = crc32(typeAndData);
    var crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, typeAndData, crcBuf]);
  }
  
  var ihdr = makeChunk('IHDR', ihdr_data);
  
  // IDAT - raw image data with filter byte per row
  var rawData = [];
  var cx = size / 2;
  var cy = size / 2;
  var radius = size * 0.38;
  
  for (var y = 0; y < size; y++) {
    rawData.push(0); // filter: none
    for (var x = 0; x < size; x++) {
      var dx = x - cx;
      var dy = y - cy;
      if (dx * dx + dy * dy < radius * radius) {
        // Inside circle - purple color
        rawData.push(88, 67, 198); // #5843ce
      } else {
        // Outside circle - light gray background
        rawData.push(245, 246, 250); // #f5f6fa
      }
    }
  }
  
  var rawBuf = Buffer.from(rawData);
  
  // Simple zlib compress using deflate (stored blocks)
  var compressed = [];
  var pos = 0;
  var bFinal = 0, bType = 0;
  
  while (pos < rawBuf.length) {
    var remaining = rawBuf.length - pos;
    var chunkLen = Math.min(remaining, 65535);
    
    if (pos + chunkLen >= rawBuf.length) {
      bFinal = 1;
    }
    
    // Stored block header
    compressed.push((bFinal) | (bType << 1));
    compressed.push(chunkLen & 0xFF);
    compressed.push((chunkLen >> 8) & 0xFF);
    compressed.push(~chunkLen & 0xFF);
    compressed.push((~chunkLen >> 8) & 0xFF);
    
    for (var k = 0; k < chunkLen; k++) {
      compressed.push(rawBuf[pos++]);
    }
  }
  
  // Adler-32 checksum
  var s1 = 1, s2 = 0;
  for (var m = 0; m < rawBuf.length; m++) {
    s1 = (s1 + rawBuf[m]) % 65521;
    s2 = (s2 + s1) % 65521;
  }
  var adler = ((s2 << 16) | s1) >>> 0;
  
  // zlib header + compressed data + checksum
  var zlibData = [0x78, 0x01]; // CM=8, CINFO=7, FCHECK
  zlibData = zlibData.concat(compressed);
  zlibData.push((adler >> 24) & 0xFF);
  zlibData.push((adler >> 16) & 0xFF);
  zlibData.push((adler >> 8) & 0xFF);
  zlibData.push(adler & 0xFF);
  
  var idat = makeChunk('IDAT', Buffer.from(zlibData));
  
  // IEND
  var iend = makeChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdr, idat, iend]);
}

fs.writeFileSync('icon-192.png', createMinimalPNG(192));
fs.writeFileSync('icon-512.png', createMinimalPNG(512));
console.log('Icons created successfully!');
