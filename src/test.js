Math.round = function (number) {
  let nums = number.toString().split(".");
  return parseFloat("0." + nums[1]) >= 0.5
    ? parseInt(nums[0]) + 1
    : parseFloat(nums[0]);
};

Math.ceil = function (number) {
  let nums = number.toString().split(".");
  return parseFloat(nums[1]) > 0 ? parseInt(nums[0]) + 1 : parseFloat(nums[0]);
};

Math.floor = function (number) {
  let nums = number.toString().split(".");
  if (parseFloat(nums[1]) > 0) {
    return parseInt(nums[0]);
  }
  return parseInt(nums[0]);
};
