import getCurrentDate from "./datePicker";
import json from './assets/json.json';
import xml from './assets/data.xml'
import WebpackIcon from './assets/icon.png';
import './styles/styles.css';

const title = document.querySelector(".main-title");
title.textContent = title.textContent.toUpperCase();

const title2 = document.createElement("h2");
title2.classList.add("date-title");
title2.textContent = "Today's date: " + getCurrentDate();
title.after(title2);

const image = document.createElement("img");
image.src = WebpackIcon;
image.className = 'webpack-image';
title2.after(image);

console.log('JSON:', json);
console.log('XML:', xml);
