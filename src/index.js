import getCurrentDate from "./datePicker";

const title = document.querySelector(".main-title");
title.textContent = title.textContent.toUpperCase();

const title2 = document.createElement("h2");
title2.classList.add("date-title");
title2.textContent = "Today's date: " + getCurrentDate();
title.after(title2);
