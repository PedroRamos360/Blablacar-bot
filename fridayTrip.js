function isTime1Bigger(time1, time2) {
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  const minutes1 = timeToMinutes(time1);
  const minutes2 = timeToMinutes(time2);

  if (minutes1 < minutes2) {
    return false;
  } else if (minutes1 >= minutes2) {
    return true;
  }
}

function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    console.log("Permission to receive notifications has already been granted");
  } else if (
    Notification.permission !== "denied" ||
    Notification.permission === "default"
  ) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Permission granted for notifications");
      } else {
        console.log("Permission denied for notifications");
      }
    });
  }
}

function getPriceFromItem(listItem) {
  const pFull = listItem.getElementsByClassName(
    "jqy9uelt jqy9ue1j jqy9ue16"
  )[0];
  const pPrice = listItem.getElementsByClassName(
    "_14356at8 hf5y4v0 _14356at0"
  )[0];
  if (!pPrice && !pFull) throw new Error("pPrice and pFull not found");
  if (pFull) return "full";
  if (pPrice) {
    const spans = pPrice.querySelectorAll("span");
    const moneySpan = spans[1];
    if (spans[1]) return moneySpan.innerText;
  }
}

function getTimesOfTrip(listItem) {
  const pTimes = listItem.getElementsByClassName("mumlx95");
  if (pTimes.length < 2) throw new Error("Times not found");
  return {
    departure: pTimes[0].innerText,
    arrival: pTimes[1].innerText,
  };
}

function getOriginAndDestination(listItem) {
  const origin = listItem.getElementsByClassName("mumlx97 mumlx98")[0];
  const destination = listItem.getElementsByClassName("mumlx97")[1];
  if (!origin || !destination)
    throw new Error("Origin or destination not found");
  return {
    origin: origin.innerText,
    destination: destination.innerText,
  };
}

function mainLoop() {
  try {
    const mainUl = document.getElementsByClassName("sc-92a9d47-0 fmsejB")[0];
    if (!mainUl) throw new Error("Main UL not found");
    const listItems = mainUl.getElementsByTagName("li");
    for (const item of listItems) {
      try {
        const price = getPriceFromItem(item);
        const times = getTimesOfTrip(item);
        const { origin, destination } = getOriginAndDestination(item);
        const tripDetails = `Trip: ${origin} ${times.departure} - ${destination} ${times.arrival} Price: ${price}`;
        console.log(tripDetails);
        if (
          origin.includes("Santa Maria") &&
          (destination.includes("Estrela") || destination.includes("Lajeado")) &&
          price !== "full" &&
          times.departure &&
          isTime1Bigger(times.departure, "15:59")
        ) {
          console.log("CARONA ENCONTRADA!");
          new Notification("Carona encontrada!\n" + tripDetails);
        }
      } catch (error) {
        continue;
      }
    }
  } catch (error) {
    console.error(error);
  }
  console.log("No trips found trying again...");
  const searchButton = document.getElementsByClassName("_4t205w0")[0];
  searchButton.click();
  setTimeout(() => window.scrollTo(0, 5000), 2000);
}

requestNotificationPermission();
setInterval(mainLoop, 15000);
