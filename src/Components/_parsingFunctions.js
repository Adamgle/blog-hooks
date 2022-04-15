const upperCaseFirst = (str, addDot) => {
  return (
    str
      .trim()
      .split("")
      .map((e, i) => (i === 0 ? e.toUpperCase() : e))
      .join("") +
    `${
      addDot &&
      /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(str[str.length - 1]) ===
        false
        ? ". "
        : ""
    }`
  );
};

const randomDate = () => {
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = 2020 + Math.trunc(Math.random() * 3);
  const currMonth = month[Math.trunc(Math.random() * month.length)];
  const isLeapYear = (0 === year % 4 && 0 !== year % 100) || 0 === year % 400;

  const days = (month) => {
    switch (month) {
      case "Jan":
      case "Mar":
      case "May":
      case "Jul":
      case "Aug":
      case "Oct":
      case "Dec":
        const n = 30;
        return 1 + Math.round(Math.random() * n);
      case "Feb":
        return isLeapYear
          ? `${1 + Math.round(Math.random() * 28)}`
          : `${1 + Math.round(Math.random() * 27)}`;
      default:
        return `${1 + Math.round(Math.random() * 29)}`;
    }
  };

  return `${month[Math.trunc(Math.random() * month.length)]}. ${days(
    currMonth
  )}. ${year}`;
};

const concatFetchedContent = (str, count = 1) => {
  const items = [];
  for (let k = 0; k < count; k++) {
    const array = str.split(" ");
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    items.push(array);
  }
  return count !== 1
    ? items
        .map((sentence) => upperCaseFirst(sentence.join(" "), true))
        .join(" ")
    : items[0].join(" ");
};

const getTodaysDate = () => {
  return new Date()
    .toString()
    .split(" ")
    .splice(1, 3)
    .join(" ")
    .split(" ")
    .join(". ");
};

const generateRandomColors = (numOfColors = 1) => {
  let letters = "0123456789ABCDEF";
  let color = "";
  let colors = [];

  for (let j = 0; j < (numOfColors <= 0 ? 1 : numOfColors); j++) {
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    colors = [...colors, `#${color}`];
    color = "";
  }
  return colors;
};

const getRandomBackgroundColor = (backgroundColor) => {
  function getRGB(c) {
    return parseInt(c, 16) || c;
  }

  function getsRGB(c) {
    return getRGB(c) / 255 <= 0.03928
      ? getRGB(c) / 255 / 12.92
      : Math.pow((getRGB(c) / 255 + 0.055) / 1.055, 2.4);
  }

  function getLuminance(hexColor) {
    return (
      0.2126 * getsRGB(hexColor.substr(1, 2)) +
      0.7152 * getsRGB(hexColor.substr(3, 2)) +
      0.0722 * getsRGB(hexColor.substr(-2))
    );
  }

  function getContrast(f, b) {
    const L1 = getLuminance(f);
    const L2 = getLuminance(b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  }

  function getTextColor(bgColor) {
    const whiteContrast = getContrast(bgColor, "#ffffff");
    const blackContrast = getContrast(bgColor, "#000000");

    return whiteContrast > blackContrast ? "#ffffff" : "#000000";
  }
  return getTextColor(backgroundColor);
};

export {
  randomDate,
  upperCaseFirst,
  concatFetchedContent,
  getTodaysDate,
  generateRandomColors,
  getRandomBackgroundColor,
};
