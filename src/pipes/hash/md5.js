export default function MD5(helpers, input) {
  function prepInputBits() {
    let outputArr = input.split("");
    //input bits are padded by a 1 & 0s until the bitlength + 64 becomes modulo 512
    outputArr.push("1");
    while ((outputArr.length + 64) % 512) outputArr.push("0");

    //the bitlength of the initBuffersial input (before padding) is appended to the padded bitstream in 64-bit format
    outputArr = outputArr
      .concat(
        helpers
          .lengthen(
            input.length.toString(2).match(/(?<=([01]+)?)[01]{1,64}/)[0],
            "0",
            64
          )
          .split("")
      )
      .join("");
    outputArr = outputArr
      .match(/.{16}/g)
      .map((_32bit) => _32bit.match(/.{8}/g).reverse().join(""));
    console.log(outputArr.join(""));

    return outputArr.join("");
  }
  const aux = [
    (b, c, d) => (((b & c) >>> 0) | (((~b >>> 0) & d) >>> 0)) >>> 0,
    (b, c, d) => (((b & d) >>> 0) | ((c & (~d >>> 0)) >>> 0)) >>> 0,
    (b, c, d) => (((b ^ c) >>> 0) ^ d) >>> 0,
    (b, c, d) => (c ^ ((b | (~d >>> 0)) >>> 0)) >>> 0,
  ];
  function add32(a, b) {
    a >>>= 0;
    b >>>= 0;
    return (a + b) % 2 ** 32;
  }
  function toUint32(arr) {
    return arr.map((num) => num >>> 0);
  }
  function compute(a, b, c, d, f, k, s, t) {
    [a, b, c, d, k, s, t] = toUint32([a, b, c, d, k, s, t]);
    a = add32(t, add32(k, add32(a, f(b >>> 0, c >>> 0, d >>> 0) >>> 0)));
    a >>>= 0;
    return add32(b, (a << s) | (a >>> (32 - s)));
  }
  function md5(stream) {
    const _512BitBlocks = stream.match(/[01]{512}/g);
    const initBuffers = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
    _512BitBlocks.forEach((block) => {
      let _32BitWords = block
        .match(/[01]{32}/g)
        .map((x) => Number(`0b${x}`) & 0xffffffff);
      let [a, b, c, d] = initBuffers;

      // round 1
      a = compute(a, b, c, d, aux[0], _32BitWords[0], 7, 0xd76aa478);
      d = compute(d, a, b, c, aux[0], _32BitWords[1], 12, 0xe8c7b756);
      c = compute(c, d, a, b, aux[0], _32BitWords[2], 17, 0x242070db);
      b = compute(b, c, d, a, aux[0], _32BitWords[3], 22, 0xc1bdceee);

      a = compute(a, b, c, d, aux[0], _32BitWords[4], 7, 0xf57c0faf);
      d = compute(d, a, b, c, aux[0], _32BitWords[5], 12, 0x4787c62a);
      c = compute(c, d, a, b, aux[0], _32BitWords[6], 17, 0xa8304613);
      b = compute(b, c, d, a, aux[0], _32BitWords[7], 22, 0xfd469501);

      a = compute(a, b, c, d, aux[0], _32BitWords[8], 7, 0x698098d8);
      d = compute(d, a, b, c, aux[0], _32BitWords[9], 12, 0x8b44f7af);
      c = compute(c, d, a, b, aux[0], _32BitWords[10], 17, 0xffff5bb1);
      b = compute(b, c, d, a, aux[0], _32BitWords[11], 22, 0x895cd7be);

      a = compute(a, b, c, d, aux[0], _32BitWords[12], 7, 0x6b901122);
      d = compute(d, a, b, c, aux[0], _32BitWords[13], 12, 0xfd987193);
      c = compute(c, d, a, b, aux[0], _32BitWords[14], 17, 0xa679438e);
      b = compute(b, c, d, a, aux[0], _32BitWords[15], 22, 0x49b40821);

      // round 2
      a = compute(a, b, c, d, aux[1], _32BitWords[1], 5, 0xf61e2562);
      d = compute(d, a, b, c, aux[1], _32BitWords[6], 9, 0xc040b340);
      c = compute(c, d, a, b, aux[1], _32BitWords[11], 14, 0x265e5a51);
      b = compute(b, c, d, a, aux[1], _32BitWords[0], 20, 0xe9b6c7aa);

      a = compute(a, b, c, d, aux[1], _32BitWords[5], 5, 0xd62f105d);
      d = compute(d, a, b, c, aux[1], _32BitWords[10], 9, 0x2441453);
      c = compute(c, d, a, b, aux[1], _32BitWords[15], 14, 0xd8a1e681);
      b = compute(b, c, d, a, aux[1], _32BitWords[4], 20, 0xe7d3fbc8);

      a = compute(a, b, c, d, aux[1], _32BitWords[9], 5, 0x21e1cde6);
      d = compute(d, a, b, c, aux[1], _32BitWords[14], 9, 0xc33707d6);
      c = compute(c, d, a, b, aux[1], _32BitWords[3], 14, 0xf4d50d87);
      b = compute(b, c, d, a, aux[1], _32BitWords[8], 20, 0x455a14ed);

      a = compute(a, b, c, d, aux[1], _32BitWords[13], 5, 0xa9e3e905);
      d = compute(d, a, b, c, aux[1], _32BitWords[2], 9, 0xfcefa3f8);
      c = compute(c, d, a, b, aux[1], _32BitWords[7], 14, 0x676f02d9);
      b = compute(b, c, d, a, aux[1], _32BitWords[12], 20, 0x8d2a4c8a);

      // round 3
      a = compute(a, b, c, d, aux[2], _32BitWords[5], 4, 0xfffa3942);
      d = compute(d, a, b, c, aux[2], _32BitWords[8], 11, 0x8771f681);
      c = compute(c, d, a, b, aux[2], _32BitWords[11], 16, 0x6d9d6122);
      b = compute(b, c, d, a, aux[2], _32BitWords[14], 23, 0xfde5380c);

      a = compute(a, b, c, d, aux[2], _32BitWords[1], 4, 0xa4beea44);
      d = compute(d, a, b, c, aux[2], _32BitWords[4], 11, 0x4bdecfa9);
      c = compute(c, d, a, b, aux[2], _32BitWords[7], 16, 0xf6bb4b60);
      b = compute(b, c, d, a, aux[2], _32BitWords[10], 23, 0xbebfbc70);

      a = compute(a, b, c, d, aux[2], _32BitWords[13], 4, 0x289b7ec6);
      d = compute(d, a, b, c, aux[2], _32BitWords[0], 11, 0xeaa127fa);
      c = compute(c, d, a, b, aux[2], _32BitWords[3], 16, 0xd4ef3085);
      b = compute(b, c, d, a, aux[2], _32BitWords[6], 23, 0x4881d05);

      a = compute(a, b, c, d, aux[2], _32BitWords[9], 4, 0xd9d4d039);
      d = compute(d, a, b, c, aux[2], _32BitWords[12], 11, 0xe6db99e5);
      c = compute(c, d, a, b, aux[2], _32BitWords[15], 16, 0x1fa27cf8);
      b = compute(b, c, d, a, aux[2], _32BitWords[2], 23, 0xc4ac5665);

      // round 4
      a = compute(a, b, c, d, aux[3], _32BitWords[0], 6, 0xf4292244);
      d = compute(d, a, b, c, aux[3], _32BitWords[7], 10, 0x432aff97);
      c = compute(c, d, a, b, aux[3], _32BitWords[14], 15, 0xab9423a7);
      b = compute(b, c, d, a, aux[3], _32BitWords[5], 21, 0xfc93a039);

      a = compute(a, b, c, d, aux[3], _32BitWords[12], 6, 0x655b59c3);
      d = compute(d, a, b, c, aux[3], _32BitWords[3], 10, 0x8f0ccc92);
      c = compute(c, d, a, b, aux[3], _32BitWords[10], 15, 0xffeff47d);
      b = compute(b, c, d, a, aux[3], _32BitWords[1], 21, 0x85845dd1);

      a = compute(a, b, c, d, aux[3], _32BitWords[8], 6, 0x6fa87e4f);
      d = compute(d, a, b, c, aux[3], _32BitWords[15], 10, 0xfe2ce6e0);
      c = compute(c, d, a, b, aux[3], _32BitWords[6], 15, 0xa3014314);
      b = compute(b, c, d, a, aux[3], _32BitWords[13], 21, 0x4e0811a1);

      a = compute(a, b, c, d, aux[3], _32BitWords[4], 6, 0xf7537e82);
      d = compute(d, a, b, c, aux[3], _32BitWords[11], 10, 0xbd3af235);
      c = compute(c, d, a, b, aux[3], _32BitWords[2], 15, 0x2ad7d2bb);
      b = compute(b, c, d, a, aux[3], _32BitWords[9], 21, 0xeb86d391);

      initBuffers[0] = add32(a, initBuffers[0]);
      initBuffers[1] = add32(b, initBuffers[1]);
      initBuffers[2] = add32(c, initBuffers[2]);
      initBuffers[3] = add32(d, initBuffers[3]);
    });
    let digest = initBuffers
      .map((d) => {
        console.log(d.toString(16).match(/.{2}/g).reverse().join(""));
        return d.toString(16).match(/.{2}/g).reverse().join("");
      })
      .join("");
    console.log(digest);
    return digest;
  }
  return md5(prepInputBits());
}

/*
function md5cycle(buffers, block) {
    let [a,b,c,d] = buffers;

    a = ff(a, b, c, d, block[0], 7, -680876936);
    d = ff(d, a, b, c, block[1], 12, -389564586);
    c = ff(c, d, a, b, block[2], 17, 606105819);
    b = ff(b, c, d, a, block[3], 22, -1044525330);
    a = ff(a, b, c, d, block[4], 7, -176418897);
    d = ff(d, a, b, c, block[5], 12, 1200080426);
    c = ff(c, d, a, b, block[6], 17, -1473231341);
    b = ff(b, c, d, a, block[7], 22, -45705983);
    a = ff(a, b, c, d, block[8], 7, 1770035416);
    d = ff(d, a, b, c, block[9], 12, -1958414417);
    c = ff(c, d, a, b, block[10], 17, -42063);
    b = ff(b, c, d, a, block[11], 22, -1990404162);
    a = ff(a, b, c, d, block[12], 7, 1804603682);
    d = ff(d, a, b, c, block[13], 12, -40341101);
    c = ff(c, d, a, b, block[14], 17, -1502002290);
    b = ff(b, c, d, a, block[15], 22, 1236535329);

    a = gg(a, b, c, d, block[1], 5, -165796510);
    d = gg(d, a, b, c, block[6], 9, -1069501632);
    c = gg(c, d, a, b, block[11], 14, 643717713);
    b = gg(b, c, d, a, block[0], 20, -373897302);
    a = gg(a, b, c, d, block[5], 5, -701558691);
    d = gg(d, a, b, c, block[10], 9, 38016083);
    c = gg(c, d, a, b, block[15], 14, -660478335);
    b = gg(b, c, d, a, block[4], 20, -405537848);
    a = gg(a, b, c, d, block[9], 5, 568446438);
    d = gg(d, a, b, c, block[14], 9, -1019803690);
    c = gg(c, d, a, b, block[3], 14, -187363961);
    b = gg(b, c, d, a, block[8], 20, 1163531501);
    a = gg(a, b, c, d, block[13], 5, -1444681467);
    d = gg(d, a, b, c, block[2], 9, -51403784);
    c = gg(c, d, a, b, block[7], 14, 1735328473);
    b = gg(b, c, d, a, block[12], 20, -1926607734);

    a = hh(a, b, c, d, block[5], 4, -378558);
    d = hh(d, a, b, c, block[8], 11, -2022574463);
    c = hh(c, d, a, b, block[11], 16, 1839030562);
    b = hh(b, c, d, a, block[14], 23, -35309556);
    a = hh(a, b, c, d, block[1], 4, -1530992060);
    d = hh(d, a, b, c, block[4], 11, 1272893353);
    c = hh(c, d, a, b, block[7], 16, -155497632);
    b = hh(b, c, d, a, block[10], 23, -1094730640);
    a = hh(a, b, c, d, block[13], 4, 681279174);
    d = hh(d, a, b, c, block[0], 11, -358537222);
    c = hh(c, d, a, b, block[3], 16, -722521979);
    b = hh(b, c, d, a, block[6], 23, 76029189);
    a = hh(a, b, c, d, block[9], 4, -640364487);
    d = hh(d, a, b, c, block[12], 11, -421815835);
    c = hh(c, d, a, b, block[15], 16, 530742520);
    b = hh(b, c, d, a, block[2], 23, -995338651);

    a = ii(a, b, c, d, block[0], 6, -198630844);
    d = ii(d, a, b, c, block[7], 10, 1126891415);
    c = ii(c, d, a, b, block[14], 15, -1416354905);
    b = ii(b, c, d, a, block[5], 21, -57434055);
    a = ii(a, b, c, d, block[12], 6, 1700485571);
    d = ii(d, a, b, c, block[3], 10, -1894986606);
    c = ii(c, d, a, b, block[10], 15, -1051523);
    b = ii(b, c, d, a, block[1], 21, -2054922799);
    a = ii(a, b, c, d, block[8], 6, 1873313359);
    d = ii(d, a, b, c, block[15], 10, -30611744);
    c = ii(c, d, a, b, block[6], 15, -1560198380);
    b = ii(b, c, d, a, block[13], 21, 1309151649);
    a = ii(a, b, c, d, block[4], 6, -145523070);
    d = ii(d, a, b, c, block[11], 10, -1120210379);
    c = ii(c, d, a, b, block[2], 15, 718787259);
    b = ii(b, c, d, a, block[9], 21, -343485551);

    buffers[0] = add32(a, buffers[0]);
    buffers[1] = add32(b, buffers[1]);
    buffers[2] = add32(c, buffers[2]);
    buffers[3] = add32(d, buffers[3]);
  }

  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }

  function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }

  function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }

  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function md51(s) {
    var txt = "";
    var n = s.length,
      state = [1732584193, -271733879, -1732584194, 271733878],
      i;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++)
      tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
    tail[i >> 2] |= 0x80 << (i % 4 << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  // there needs to be support for Unicode here,
  // unless we pretend that we can redefine the MD-5
  // algorithm for multi-byte characters (perhaps
  // by adding every four 16-bit characters and
  // shortening the sum to 32 bits). Otherwise
  // I suggest performing MD-5 as if every character
  // was two bytes--e.g., 0040 0025 = @%--but then
  // how will an ordinary MD-5 sum be matched?
  // There is no way to standardize text to something
  // like UTF-8 before transformation; speed cost is
  // utterly prohibitive. The JavaScript standard
  // itself needs to look at this: it should start
  // providing access to strings as preformed UTF-8
  // 8-bit unsigned value arrays.

  function md5blk(s) {
    // I figured global was faster. 
    var md5blks = []; // Andy King said do it this way.
    for (let i = 0; i < 64; i += 4) {
      md5blks[i >> 2] =
        s.charCodeAt(i) +
        (s.charCodeAt(i + 1) << 8) +
        (s.charCodeAt(i + 2) << 16) +
        (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  var hex_chr = "0123456789abcdef".split("");

  function rhex(n) {
    var s = "";
    for (let j = 0; j < 4; j++)
      s += hex_chr[(n >> (j * 8 + 4)) & 0x0f] + hex_chr[(n >> (j * 8)) & 0x0f];
    return s;
  }

  function hex(x) {
    for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]);
    return x.join("");
  }

  function md5(s) {
    return hex(md51(s));
  }

  //  this function is much faster,
  //  so if possible we use it. Some IEs
  //  are the only ones I know of that
  //  need the idiotic second function,
  //  generated by an if clause.

  function add32(a, b) {
    return (a + b) & 0xffffffff;
  }

  if (md5("hello") != "5d41402abc4b2a76b9719d911017c592") {
    function add32(x, y) {
      var lsw = (x & 0xffff) + (y & 0xffff),
        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xffff);
    }
  }
*/
