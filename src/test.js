function sumAll(...args) {
  return args.reduce((ele, acc) => acc + ele);
}

console.log(sumAll(2, 3, 5, 2, 345, 123, 41, 123, 12, 4, 5));
