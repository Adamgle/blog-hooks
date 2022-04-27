let a = () => ({ a: 123, b: 456 });

const { a: c, b: d } = a();
console.log(c, d)