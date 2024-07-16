import undetected_chromedriver as uc
from selenium.webdriver.common.by import By

options = uc.ChromeOptions()
options.add_argument("--blink-settings=imagesEnabled=false")

driver = uc.Chrome(options=options)
driver.get(
    "https://www.blablacar.com.br/search?fn=Santa%20Maria%2C%20RS%2C%20Brasil&tn=Estrela%2C%20RS%2C%20Brasil&db=2024-07-19&seats=1&search_origin=HOME&from_place_id=eyJpIjoiQ2hJSk01V0xTa1BLQTVVUjJhVFg1SmJNWFdNIiwicCI6MSwidiI6MSwidCI6WzRdfQ%3D%3D&to_place_id=eyJpIjoiQ2hJSk02dGJROFpqSEpVUjEzVEtsdV9yalFrIiwicCI6MSwidiI6MSwidCI6WzRdfQ%3D%3D"
)

main_ul = driver.find_element(By.CLASS_NAME, "sc-c27d0bf9-0")
list_items = main_ul.find_elements(By.TAG_NAME, "li")
trips_data = []
for item in list_items:
    elements = item.text.split("\n")
    if len(elements) < 5:
        continue
    departure = elements[0]
    arrival = elements[3]
    origin = elements[2]
    destination = elements[4]
    price = elements[5]
    if destination.startswith("+"):
        destination = elements[5]
        price = elements[6]
    trips_data.append(
        {
            "departure": departure,
            "arrival": arrival,
            "origin": origin,
            "destination": destination,
            "price": price,
        }
    )

print(trips_data)
