export default function binConvert(number, bitLength, type) {
  switch (type) {
    case "toBin": {
      let remainders = [];
      let num = number;
      while (num > 0) {
        remainders.push(num % 2);
        num = Math.floor(num / 2);
      }
      if (remainders.length < bitLength) {
        while (remainders.length < bitLength) {
          remainders.push(0);
        }
      }
      return remainders.reverse().join("");
      break;
    }
    case "toDec": {
      let splitted = String(number).split("").reverse();
      splitted = splitted.map((num, index) => num * 2 ** index);
      let sum = splitted.reduce((prev, current) => prev + current, 0);
      return sum;
      break;
    }
  }
}
