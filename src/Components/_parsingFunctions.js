const upperCaseFirst = (str, addDot) => {
  return (
    str
      .trim()
      .split("")
      .map((e, i) => (i === 0 ? e.toUpperCase() : e))
      .join("") +
    `${
      addDot &&
      /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(str[str.length - 1]) ===
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

export { randomDate, upperCaseFirst, concatFetchedContent, getTodaysDate };
