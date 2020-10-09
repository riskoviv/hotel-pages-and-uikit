#!/bin/sh
cat ./src/js/slider.js > ./src/js/tmp.js
cat ./src/js/responsive.js >> ./src/js/tmp.js
java -jar ./vendor/yuicompressor-2.4.8.jar --type js ./src/js/tmp.js -o ./dist/js/slider.min.js
java -jar ./vendor/yuicompressor-2.4.8.jar --type css ./src/css/slider.css -o ./dist/css/slider.min.css
rm ./src/js/tmp.js
