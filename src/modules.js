import Ascii85 from "./components/ascii85/Ascii85";
import Base64 from "./components/base64/Base64";
import Base32 from "./components/base32/Base32";
import Vigenere from "./components/vigenere/Vigenere";
import Reverse from "./components/reverse/Reverse";
import A1Z26 from "./components/a1z26/A1Z26";
import Caesar from "./components/caesar/Caesar";
import Rot13 from "./components/rot/Rot13";
import Morse from "./components/morse/Morse";
import Braille from "./components/braille/Braille";
import Xor from "./components/xor/Xor";
import Replace from "./components/replace/Replace";
import SpellingAlphabet from "./components/spellingalphabet/SpellingAlphabet";
import CaseTransform from "./components/casetransform/CaseTransform";
import BitwiseOperation from "./components/bitwiseoperation/BitwiseOperation";
import NumeralSystem from "./components/numeralsystem/NumeralSystem";
import AlphabeticalSub from "./components/alphabeticalsub/AlphabeticalSub";
import UnicodePoints from "./components/unicodepoints/UnicodePoints";
import UrlEncoding from "./components/urlencoding/UrlEncoding";
import RailFence from "./components/railfence/RailFence";
import Bacon from "./components/bacon/Bacon";
import Hash from "./components/hash/Hash";
import HMAC from "./components/hmac/HMAC";
import AES from "./components/aes/AES";
import RC4 from "./components/rc4/RC4";
import NihilistCipher from "./components/nihilist/NihilistCipher";

const Modules = [
  {
    Component: A1Z26,
    identifier: "A1Z26",
    category: "ciphers",
    title: "A1Z26",
    asymmetric: true,
    descryption:
      '<h3>What is A1Z26?</h3><p>A1Z26 as it\'s name suggests, is a simple cipher that converts each alphabetic character of plaintext to the number that represents it in alphabete(from 1 to 26). a plaintext like<code>"hello"</code> with a seperator of<code>"/"</code>would result to <code>"8/5/12/12/15"</code>.</p>',
    guide:
      "<h3>Guide:</h3><ul><li>Make sure to always include seperator.</li><li>Any non-alphabetic characters in plaintext will be excluded in ciphertext as well as any character outside of value-seperation boundary in ciphertext.</li></ul>"
  },
  {
    Component: AlphabeticalSub,
    identifier: "AlphabeticalSub",
    category: "ciphers",
    title: "Substitution cipher",
    asymmetric: false,
    descryption:
      '<h3>What is Substitution cipher?</h3><p>In cryptography, a substitution cipher is a method of encrypting in which units of plaintext are replaced with the ciphertext, in a defined manner, with the help of a key; the "units" may be single letters (the most common), pairs of letters, triplets of letters, mixtures of the above, and so forth. The receiver deciphers the text by performing the inverse substitution process to extract the original message.</p><p>Substitution ciphers can be compared with transposition ciphers. In a transposition cipher, the units of the plaintext are rearranged in a different and usually quite complex order, but the units themselves are left unchanged. By contrast, in a substitution cipher, the units of the plaintext are retained in the same sequence in the ciphertext, but the units themselves are altered.</p><p>There are a number of different types of substitution cipher. If the cipher operates on single letters, it is termed a simple substitution cipher; a cipher that operates on larger groups of letters is termed polygraphic. A monoalphabetic cipher uses fixed substitution over the entire message, whereas a polyalphabetic cipher uses a number of substitutions at different positions in the message, where a unit from the plaintext is mapped to one of several possibilities in the ciphertext and vice versa.</p><a href="https://en.wikipedia.org/wiki/Substitution_cipher" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>',
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: Ascii85,
    identifier: "Ascii85",
    category: "encoding",
    title: "Ascii85",
    asymmetric: true,
    descryption:
      '<h3>What is Ascii85(Base85)?</h3><p>Ascii85, also called Base85, is a form of binary-to-text encoding developed by Paul E. Rutter for the btoa utility. By using five ASCII characters to represent four bytes of binary data (making the encoded size 1/4 larger than the original, assuming eight bits per ASCII character), it is more efficient than uuencode or Base64, which use four characters to represent three bytes of data (1/3 increase, assuming eight bits per ASCII character).</p><p>Its main modern uses are in original\'s PostScript and Portable Document Format file formats, as well as in the patch encoding for binary files used by Git.</p><a href="https://en.wikipedia.org/wiki/Ascii85" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>',
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: Base32,
    identifier: "Base32",
    category: "encoding",
    title: "Base32",
    asymmetric: true,
    descryption:
      '<h3>What is Base32?</h3><p>In computer programming, Base32 is a group of binary-to-text encoding schemes that represent binary data (more specifically, a sequence of 8-bit bytes) in sequences of 40 bits that can be represented by eight 5-bit Base32 digits.</p><p>Base32 uses a set of 32 digits, each of which can be represented by 5 bits. One way to represent Base32 numbers in a human-readable way is by using a standard 32-character set, such as the twenty-two upper-case letters A-V and the digits 0-9. However, many other variations are used in different contexts.</p><a href="https://en.wikipedia.org/wiki/Base32" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>',
    guide:
      "<h3>Guide:</h3><ul><li>1. Base32 is case-sensitive. When decoding in 3 first variants(original, crockford, base32hex) the characters of encoded data are all uppercase unlike z-base-32 which requires all text be in lowercase. So bear that in mind.</li></ul>"
  },
  {
    Component: Base64,
    identifier: "Base64",
    category: "encoding",
    title: "Base64",
    asymmetric: true,
    descryption:
      '<h3>What is Base64?</h3><p>In computer programming, Base64 is a group of binary-to-text encoding schemes that represent binary data (more specifically, a sequence of 8-bit bytes) in sequences of 24 bits that can be represented by four 6-bit Base64 digits.</p><p>Common to all binary-to-text encoding schemes, Base64 is designed to carry data stored in binary formats across channels that only reliably support text content. Base64 is particularly prevalent on the World Wide Web[1] where one of its uses is the ability to embed image files or other binary assets inside textual assets such as HTML and CSS files</p><p>Base64 is also widely used for sending e-mail attachments. This is required because SMTP – in its original form – was designed to transport 7-bit ASCII characters only. This encoding causes an overhead of 33–37% (33% by the encoding itself; up to 4% more by the inserted line breaks).</p><a href="https://en.wikipedia.org/wiki/Base64" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>',
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: BitwiseOperation,
    identifier: "BitwiseOperation",
    category: "transform",
    title: "Bitwise operation",
    asymmetric: false,
    descryption: "<p>none</p>",
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: Braille,
    identifier: "Braille",
    category: "alphabet",
    title: "Braille",
    asymmetric: true,
    descryption:
      '<h3>What is Braille?</h3><p>Braille is a tactile writing system used by people who are visually impaired, including people who are blind, deafblind or who have low vision. It can be read either on embossed paper or by using refreshable braille displays that connect to computers and smartphone devices. Braille can be written using a slate and stylus, a braille writer, an electronic braille notetaker or with the use of a computer connected to a braille embosser.</p><p>Braille characters are formed using a combination of six raised dots arranged in a 3*2 matrix, called the braille cell. The number and arrangement of these dots distinguishes one character from another. Since the various braille alphabets originated as transcription codes for printed writing, the mappings (sets of character designations) vary from language to language, and even within one; in English Braille there are 3 types of braille:</p><ul><li>grade 1 – a letter-by-letter transcription used for basic literacy;</li><li>grade 2 – an addition of abbreviations and contractions used as a space-saving mechanism;</li><li>grade 3 – various non-standardized personal stenography that is less commonly used.</li></ul><a href="https://en.wikipedia.org/wiki/Braille" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>',
    guide:
      "<h3>Guide:</h3><ul><li>Grade 2 contraction system is a work in progress. Some translations in decode phase may not work as expected.</li><li>For more accurate translations, it is important for the text to be as grammatically and punctually valid as possible.</li></ul>"
  },
  {
    Component: Caesar,
    identifier: "Caesar",
    category: "ciphers",
    title: "Caesar cipher",
    asymmetric: true,
    descryption: "<p>none</p>",
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: CaseTransform,
    identifier: "CaseTransform",
    category: "transform",
    title: "Case transform",
    asymmetric: false,
    descryption: "<p>none</p>",
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: Morse,
    identifier: "Morse",
    category: "encoding",
    title: "Morse code",
    asymmetric: true,
    descryption:
      '<h3>What is Morse Code?</h3><p>Morse code is a method used in telecommunication to encode text characters as standardized sequences of two different signal durations, called dots and dashes, or dits and dahs. Morse code is named after Samuel Morse, one of the inventors of the telegraph.</p><a href="https://en.wikipedia.org/wiki/Morse_code" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>',
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: NumeralSystem,
    identifier: "NumeralSystem",
    category: "transform",
    title: "Numeral system",
    asymmetric: false,
    descryption:
      '<h3>What is a numeral system?</h3><p>A numeral system (or system of numeration) is a writing system for expressing numbers; that is, a mathematical notation for representing numbers of a given set, using digits or other symbols in a consistent manner.</p><p>The same sequence of symbols may represent different numbers in different numeral systems. For example, "11" represents the number eleven in the decimal numeral system (used in common life), the number three in the binary numeral system (used in computers), and the number two in the unary numeral system (e.g. used in tallying scores).</p><a href="https://en.wikipedia.org/wiki/Numeral_system" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>',
    guide:
      "<h3>Guide:</h3><ul><li>This module provides support between conversion of numeral systems categorized by either notation(base) or historical significance. Some of the popular ones are:</li><ul><li>Binary: Binary or base 2 consists of 1s and 0s. It is the system that computers understand at a core level.</li><li>Octal: Octal or base 8 is a counting system similar to binary, except that digits vary from 0 to 7.</li><li>Decimal: Decimal or base 10, is the system that most humans in the world are taught to use. the characters range from 0 to 9.</li><li>Hexadecimal: Hexadecimal (hex) or base 16 is a system that has played a major role in computer science alongside binary. the characters consist of 0 to 9 and A to F from alphabet.</li><li>Roman numerals: Roman numerals are a set of latin symbols that represent a rather limited set of numbers. It was the prevalent counting system in ancient Rome and most other parts of Europe. The numbers on the Big Ben tower's clock in London are written in Roman. the Numbers 0 through 12 are as follows: I, II, III, IV, V, VI ,VII, VIII, IX, X, XI, XII.</li></ul><li>If you want to convert multiple numbers simultaneously, seperate them with a line break.</li></ul>"
  },
  {
    Component: Replace,
    identifier: "Replace",
    category: "transform",
    title: "Replace",
    asymmetric: false,
    descryption: "<h3>Descryption:</h3><p>none</p>",
    guide:
      "<h3>Guide:</h3><ul><li>The Regex engine used in this specific toolset is JavaScript's built-in engine</li><li>The only supported syntax for regular expressions at this moment is the JavaScripts literals syntax for regular expressions. (/.../mod)</li></ul>"
  },
  {
    Component: Reverse,
    identifier: "Reverse",
    category: "transform",
    title: "Reverse",
    asymmetric: false,
    descryption: "<h3>Descryption:</h3><p>none</p>",
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: Rot13,
    identifier: "Rot13",
    category: "ciphers",
    title: "ROT-13",
    asymmetric: false,
    descryption: "<h3>Descryption:</h3><p>none</p>",
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: SpellingAlphabet,
    identifier: "SpellingAlphabet",
    category: "alphabet",
    title: "Spelling alphabet",
    asymmetric: true,
    descryption:
      '<h3>What is Spelling Alphabet?</h3><p>A spelling alphabet (also called by various other names) is a set of words used to stand for the letters of an alphabet in oral communication (speech), especially when over a two-way radio or telephone. The words are chosen because they sound sufficiently different from each other to avoid any confusion that could easily otherwise result from the names of letters that sound similar except for some small difference easily missed or easily degraded by the imperfect sound quality of the apparatus. For example, "bee" and "pee" and "dee" sound similar and could easily be confused, but "bravo" and "papa" and "delta" sound different, making confusion unlikely.</p><p>Any suitable words can be used in the moment, making this form of communication easy even for people not trained on any particular standardized spelling alphabet. For example, it is common to hear a nonce form like "A as in \'apple\', D as in \'dog\', P as in \'paper\'" over the telephone in customer support contexts. However, to gain the advantages of standardization in contexts involving trained persons, a standard version can be convened by an organization. Many (loosely or strictly) standardized spelling alphabets exist, mostly owing to historical siloization, where each organization simply created its own. International air travel created a need for a worldwide standard. Today the most widely known spelling alphabet is the ICAO International Radiotelephony Spelling Alphabet, also known as the NATO phonetic alphabet.</p><a href="https://en.wikipedia.org/wiki/Spelling_alphabet" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>',
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: UnicodePoints,
    identifier: "UnicodePoints",
    category: "encoding",
    title: "Unicode code points",
    asymmetric: true,
    descryption:
      '<h3>What is Unicode?</h3><p>Unicode, formally The Unicode Standard is an information technology standard for the consistent encoding, representation, and handling of text expressed in most of the world\'s writing systems.</p><p>Unicode\'s success at unifying character sets has led to its widespread and predominant use in the internationalization and localization of computer software. The standard has been implemented in many recent technologies, including modern operating systems, XML, and most modern programming languages.</p><a href="https://en.wikipedia.org/wiki/Unicode" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>',
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: UrlEncoding,
    identifier: "UrlEncoding",
    category: "encoding",
    title: "URL encoding",
    asymmetric: true,
    descryption:
      '<h3>What is URL encoding?</h3><p>Percent-encoding, also known as URL encoding, is a method to encode arbitrary data in a Uniform Resource Identifier (URI) using only the limited US-ASCII characters legal within a URI. Although it is known as URL encoding, it is also used more generally within the main Uniform Resource Identifier (URI) set, which includes both Uniform Resource Locator (URL) and Uniform Resource Name (URN). As such, it is also used in the preparation of data of the application/x-www-form-urlencoded media type, as is often used in the submission of HTML form data in HTTP requests.</p><a href="https://en.wikipedia.org/wiki/Percent-encoding" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>',
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: Vigenere,
    identifier: "Vigenere",
    category: "ciphers",
    title: "Vigenère cipher",
    asymmetric: true,
    descryption:
      '<h3>What is Vigenère Cipher?</h3><p>The Vigenère cipher is a method of encodeing alphabetic text by using a series of interwoven Caesar ciphers, based on the letters of a keyword on a 26*26 table known as Vigenere Square (<a href="https://en.wikipedia.org/wiki/Tabula_recta" target="_blank">or Tabula Recta</a>) . It employs a form of polyalphabetic substitution.</p><p>First described by Giovan Battista Bellaso in 1553, the cipher is easy to understand and implement, but it resisted all attempts to break it until 1863, three centuries later. This earned it the description le chiffrage indéchiffrable (French for \'the indecipherable cipher\'). Many people have tried to implement encodeion schemes that are essentially Vigenère ciphers. In 1863, Friedrich Kasiski was the first to publish a general method of deciphering Vigenère ciphers.</p><a href="https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>',
    guide:
      "<h3>Guide:</h3><ul><li>The table consists of the alphabets written out 26 times in different rows, each alphabet shifted cyclically to the left compared to the previous alphabet, corresponding to the 26 possible Caesar Ciphers.</li><li>At different points in the encoding process, the cipher uses a different alphabet from one of the rows.</li><li>The alphabet used at each point depends on a repeating keyword.</li></ul>"
  },
  {
    Component: Xor,
    identifier: "Xor",
    category: "ciphers",
    title: "XOR cipher",
    asymmetric: false,
    descryption:
      '<h3>What is XOR cipher?</h3><p>In cryptography, the simple XOR cipher is a type of additive cipher, an ciphers algorithm that operates according to the principles:</p><ul><li>A ⊕ 0 = A,</li><li>A ⊕ A = 0,</li><li>A ⊕ B = B ⊕ A,</li><li>(A ⊕ B) ⊕ C = A ⊕ (B ⊕ C),</li><li>(B ⊕ A) ⊕ A = B ⊕ 0 = B,</li></ul><p>where ⊕ denotes the exclusive disjunction (XOR) operation. This operation is sometimes called modulus 2 addition (or subtraction, which is identical). With this logic, a string of text can be encrypted by applying the bitwise XOR operator to every character using a given key. To decrypt the output, merely reapplying the XOR function with the key will remove the cipher.</p><a href="https://en.wikipedia.org/wiki/XOR_cipher" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>',
    guide:
      "<h3>Guide:</h3><ul><li>Seperation of bytes by spaces in key field is only used for readability reasons and serves no other purpose.<code>11011010 10101001</code> and <code>1101101010101001</code> practically have the same result.</li><li>Spaces are only valid when used in following manner: <code>\"10011001 00011111 10....\"</code>. Using more than one space side by side and/or not ending up with groups of 8 bits are considered invalid format.</li><li>It's recommended to use a key with the same length of bytes as input since it's the most secure practice, however if user given key is shorter than the input our tool will modularly extend it</li></ul>"
  },
  {
    Component: RailFence,
    identifier: "RailFence",
    category: "ciphers",
    title: "Rail fence cipher",
    asymmetric: true,
    descryption:
      '<h3>What is Railfence cipher?</h3><p>The rail fence cipher (also called a zigzag cipher) is a classical type of transposition cipher. It derives its name from the manner in which encryption is performed, in analogy to a fence built with horizontal rails. </p><a href="https://en.wikipedia.org/wiki/Rail_fence_cipher" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>',
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: Bacon,
    identifier: "Bacon",
    category: "ciphers",
    title: "Bacon cipher",
    asymmetric: true,
    descryption: "<h3>Descryption:</h3><p>none</p>",
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    //Component: "Units",
    identifier: "Units",
    category: "mathematics",
    title: "Units",
    asymmetric: true,
    descryption: "<h3>Descryption:</h3><p>none</p>",
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: Hash,
    identifier: "Hash",
    category: "modern cryptography",
    title: "Hash function",
    asymmetric: true,
    descryption: `<h3>What is a hash function?</h3><p>A hash function is any function that can be used to map data of arbitrary size to fixed-size hexadecimal output, though there are some hash functions that support variable length output. The output returned by a hash function is usually called a hash digest, or simply hash.</p><p> Hashes are one-way functions in the sense that the digest cannot be reversed or decrypted to retrive the original input, as such they are widely used in fields of computer science and cryptography. Some real world examples of their use cases are:</p><ul><li>User authentication proceedures by online services</li><li>Integrity checking of files sent over the internet</li><li>Secure storage of passwords on a database without serious threats in case of compromise (if user password is strong enough against dictionary attacks)</li></ul><a href="https://en.wikipedia.org/wiki/Hash_function" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>`,
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: AES,
    identifier: "AES",
    category: "modern cryptography",
    title: "AES",
    asymmetric: true,
    descryption: "<h3>Descryption:</h3><p>none</p>",
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: HMAC,
    identifier: "HMAC",
    category: "modern cryptography",
    title: "HMAC",
    asymmetric: true,
    descryption: "<h3>Descryption:</h3><p>none</p>",
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: RC4,
    identifier: "RC4",
    category: "modern cryptography",
    title: "RC4",
    asymmetric: true,
    descryption: "<h3>Descryption:</h3><p>none</p>",
    guide: "<h3>Guide:</h3><p>none</p>"
  },
  {
    Component: NihilistCipher,
    identifier: "NihilistCipher",
    category: "ciphers",
    title: "Nihilist cipher",
    asymmetric: true,
    descryption: `<h3>What is Nihilist cipher?</h3><p>In the history of cryptography, the Nihilist cipher is a manually operated symmetric encryption cipher, originally used by Russian Nihilists in the 1880s to organize terrorism against the tsarist regime. The term is sometimes extended to several improved algorithms used much later for communication by the First Chief Directorate with its spies.</p><a href="https://en.wikipedia.org/wiki/Rail_fence_cipher" target="_blank">read more at Wikipedia <i class="fas fa-external-link-alt"></i></a>`,
    guide: `<h3>Guide:</h3><ul><li>Key 1 is used to lay out the custom polybius square that is used for en/decryption</li><li>Key 2 is used in the main process of conversion (mapping each character of key with the corresponding character of plaintext at a given index)</li><li>Seperator as it's name suggests is the character or phrase that that comes inbetween each chunk of the output</li></ul><p>If Key 2 is shorter than plaintext length, it will be padded in repeating order until same length. (given plaintext of: attackatdawn and key of: hello, the key will become ===> hellohellohe)</p><p>If Key 2 is longer than plaintext length, the chunk with exact same length will be taken as key starting from index 0. (given plaintext of: attackatdawn and key of: thisisalongkey, the key will become ===> thisisalongk<p>`
  }
];
export default Modules;
