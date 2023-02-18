export default function MD5(helpers, input) {
  function prepInputBits() {
    let inputArr = input.split("");
    //input bits are padded by a 1 & 0s until the bitlength + 64 becomes modulo 512
    inputArr.push("1");
    while ((inputArr.length + 64) % 512) inputArr.push("0");

    //the bitlength of the initBuffersial input (before padding) is appended to the padded bitstream in 64-bit format
    inputArr = inputArr.concat(
      helpers
        .lengthen(
          input.length.toString(2).match(/(?<=([01]+)?)[01]{1,64}/)[0],
          "0",
          64
        )
        .split("")
    );
    //console.log(inputArr.join(""));
    return inputArr.join("");
  }
  const aux = [
    (b, c, d) => (b & c) | (~b & d),
    (b, c, d) => (b & d) | (c & ~d),
    (b, c, d) => b ^ c ^ d,
    (b, c, d) => c ^ (b | ~d),
  ];
  function add32(a, b) {
    return (a + b) % 2 ** 32;
  }
  function compute(a, b, c, d, f, k, s, t) {
    a = add32(add32(a, f(b, c, d)), add32(k, t));
    return add32(b, a << s);
  }
  function md5(stream) {
    const _512BitBlocks = stream.match(/[01]{512}/g);
    const initBuffers = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
    _512BitBlocks.forEach((block) => {
      let _32BitWords = block.match(/[01]{32}/g);
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
    //console.log(initBuffers);
    return initBuffers.map((d) => d.toString(16)).join("");
  }
  prepInputBits();
  return md5(prepInputBits());
}
