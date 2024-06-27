# from selenium import webdriver
from seleniumwire import webdriver  # Import from seleniumwire
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

import pickle
import json

options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# driver = webdriver.Chrome()

driver.get("https://www.nseindia.com")

print(driver.title)

for request in driver.requests:
    if request.response:
        print(
            request.url,
            request.response.status_code,
            request.response.headers['Content-Type']
        )


# print(driver.page_source)

# print(driver)
# pickle.dump( driver.get_cookies() , open("cookies.pkl","wb"))

driver.close()
