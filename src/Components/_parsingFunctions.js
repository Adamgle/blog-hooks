import React, { useRef, useCallback, useMemo } from "react";

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
  // console.log("run")
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

const generateTopic = () => {
  const topics = ["technology", "politics", "science", "lifestyle", "biznes"];
  return topics[Math.trunc(Math.random() * topics.length)];
};

const generateTags = (topic) => {
  // 5 - 10
  const topics = {
    technology: [
      "Computers",
      "Programming",
      "AI",
      "Front-end",
      "Back-end",
      "Javacript",
      "C++",
      "Java",
      "Web Development",
      "Software Development",
      "Networking",
    ],
    politics: [
      "War",
      "Fraud",
      "Lie",
      "Coruption",
      "Joe Biden",
      "Donal Trump",
      "Propaganda",
      "Vladimir Putin",
      "Help Ukraine",
      "News",
    ],
    science: [
      "Math",
      "Biology",
      "IT",
      "Computer Science",
      "Psychology",
      "Space",
      "Astronomy",
      "AI",
      "Anatomy",
      "Diet",
      "Equations",
    ],
    lifestyle: [
      "Cleaning",
      "Washing",
      "Shopping",
      "Cooking",
      "School",
      "College",
      "Learning",
      "Good Habits",
      "Life Hacks",
      "Netflix",
      "Movies",
    ],
    biznes: [
      "Inflation",
      "Biznes Plan",
      "Start-up",
      "Jobs",
      "Starting a Company",
      "Donaitions",
      "Banking",
      "NFT",
      "Bitcoin",
      "Etherum",
      "Cryptocurrencies",
    ],
  };
  const tagsNum = Math.round(
    topics[topic].length / 2 + (Math.random() * topics[topic].length) / 2
  );
  const getArrayOfTags = () => {
    const tags = [];
    for (let i = 0; i < tagsNum; i++) {
      let randomIndex = Math.trunc(Math.random() * topics[topic].length);
      let currentTag = topics[topic][randomIndex];
      if (tags.includes(currentTag)) {
        // CURRENT TAG CAN'T BE USED THERE 'CAUSE
        // VARIABLE VALUE IS NOT AFFECTED BY THE WHILE LOOP
        while (tags.includes(topics[topic][randomIndex])) {
          randomIndex = Math.trunc(Math.random() * topics[topic].length);
        }
      }
      // CURRENT TAG CAN'T BE USED THERE 'CAUSE
      // VARIABLE VALUE IS NOT AFFECTED BY THE WHILE LOOP
      // VALUE OF THE VARIABLE IS ALWAYS THE SAME
      // SO THE RANDOMIZAITION DOES NO EXITS
      // ALTHOUTH, IT CAN BE USE THERE IF VARIABLE IS BEEING OVERWRITTEN
      // IN THE WHILE LOOP
      tags.push(topics[topic][randomIndex]);
    }
    return tags;
  };

  return getArrayOfTags();
};

export {
  randomDate,
  upperCaseFirst,
  concatFetchedContent,
  getTodaysDate,
  generateRandomColors,
  getRandomBackgroundColor,
  generateTopic,
  generateTags,
};
