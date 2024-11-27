const tripData = {
  origins: ["Estrela", "Lajeado"],
  destinations: ["Santa Maria"],
  timeBiggerThan: "14:00",
};

function isTime1Bigger(time1, time2) {
  const [h1, m1] = time1.split(":").map(Number);
  const [h2, m2] = time2.split(":").map(Number);
  return h1 > h2 || (h1 === h2 && m1 >= m2);
}

function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.error("This browser does not support desktop notifications.");
    return;
  }
  if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      console.log(`Notification permission: ${permission}`);
    });
  }
}

function getPriceFromItem(listItem) {
  const priceElement = listItem.querySelector(
    'span[data-testid="e2e-tripcard-price-price-value"]'
  );
  if (!priceElement) return "full";
  const priceText = priceElement.innerText.replace("R$ ", "").trim();
  console.log(`Price found: ${priceText}`);
  return priceText;
}

function getTimesOfTrip(listItem) {
  const times = listItem.querySelectorAll('p[data-testid^="e2e-itinerary-"]');
  if (times.length < 2) throw new Error("Times not found");
  const departure = times[0].innerText.trim();
  const arrival = times[1].innerText.trim();
  console.log(`Times found: Departure - ${departure}, Arrival - ${arrival}`);
  return { departure, arrival };
}

function getOriginAndDestination(listItem) {
  try {
    const originDest = listItem.getElementsByClassName("_1uhfo5t7");
    
    if (originDest.length < 2) {
      console.warn("Origin or destination not found.");
      return { origin: "", destination: "" };
    }

    const origin = originDest[0].textContent.trim();
    const destination = originDest[1].textContent.trim();

    console.log(`Origin: ${origin}, Destination: ${destination}`);
    return { origin, destination };
  } catch (error) {
    console.error("Error in getOriginAndDestination:", error);
    return { origin: "", destination: "" };
  }
}

function isTripValid(origin, destination, price, departureTime) {
  const originCorrect = tripData.origins.some((o) =>
    origin.includes(o)
  );
  const destinationCorrect = tripData.destinations.some((d) =>
    destination.includes(d)
  );
  const isValid = originCorrect && destinationCorrect &&
    price !== "full" &&
    isTime1Bigger(departureTime, tripData.timeBiggerThan);

  console.log(
    `Trip Valid? ${isValid} | Origin Valid: ${originCorrect} | ` +
    `Destination Valid: ${destinationCorrect}`
  );
  return isValid;
}

function mainLoop() {
  try {
    const mainUl = document.querySelector(".sc-92a9d47-0.fmsejB");
    if (!mainUl) throw new Error("Main UL not found");

    const listItems = mainUl.querySelectorAll("li");
    console.log(`Found ${listItems.length} trips`);

    for (const item of listItems) {
      try {
        const price = getPriceFromItem(item);
        const { departure, arrival } = getTimesOfTrip(item);
        const { origin, destination } = getOriginAndDestination(item);

        const tripDetails = `Trip: ${origin} ${departure} - ${destination} ${arrival} Price: R$ ${price}`;
        console.log(tripDetails);

        if (isTripValid(origin, destination, price, departure)) {
          console.log("Trip found!");
          new Notification("Trip found!\n" + tripDetails);
        }
      } catch (error) {
        console.warn(`Error processing trip: ${error.message}`);
        continue;
      }
    }
  } catch (error) {
    console.error(`Main loop error: ${error.message}`);
  }

  console.log("No valid trips found, retrying...");
  const searchButton = document.querySelector("._4t205w0");
  if (searchButton) searchButton.click();
  setTimeout(() => window.scrollTo(0, 5000), 2000);
}

requestNotificationPermission();
setInterval(mainLoop, 15000);
