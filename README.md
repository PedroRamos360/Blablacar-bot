# Blablacar BOT

Bot to automatically reserve blablacar trips for me. My first attempt was failed, using selenium, because blablacar.com imediately detects it.
I tried to use tools like selenium stealth but it still can detect it, my best shot is a semi-automatic bot copying and paste javascript in the
console of the page. That is the goal of this project.

The final product has some limitations since things like updating the page or opening a new page cleans the console and the script can go any further,
so it only checks for trips periodically (clicking the search box to update results) and gives an alert in the browser if a trip was found.
