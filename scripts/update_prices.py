#!/usr/bin/env python3
import requests
import sys
import json
import os
from pprint import pprint
import re

DATA_PATH = f"{os.path.dirname(os.path.realpath(__file__))}/../api/registrars/data"


def get_gbp_to_usd_rate():
    url = "https://api.exchangerate.host/latest?base=GBP"
    response = requests.get(url)
    data = response.json()
    return data["rates"]["USD"]


def update_namecheap_prices():
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0",
            "Accept": "*/*",
            "Accept-Language": "en-GB,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Referer": "https://www.namecheap.com/domains/",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "Content-Type": "text/plain;charset=UTF-8",
            "Origin": "https://www.namecheap.com",
            "Connection": "keep-alive",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "DNT": "1",
            "Sec-GPC": "1",
            "TE": "trailers",
        }

        data = '{"request":{"Term":"","Duration":1,"TldsRequestType":"ExceptTlds","Tlds":[]}}'
        response = requests.post(
            "https://www.namecheap.com/api/v1/ncpl/landingpages/gateway/getdomainspricingdetails",
            headers=headers,
            data=data,
        ).json()
    except requests.exceptions.JSONDecodeError as e:
        return f"Failed to parse JSON: {e}"
    except requests.exceptions.RequestException as e:
        return f"Failed to fetch data from URL: {e}"
    except Exception as e:
        return "An unexpected error occurred: {e}"

    price_map = {}

    for tld in response:
        try:
            price_map[f".{tld['Tld']}"] = tld["Register"]["Price"]
        except:
            print(f"Error parsing {tld}")

    with open(f"{DATA_PATH}/namecheap.json", "w+") as f:
        json.dump(price_map, f)

    return "OK"


def update_namescouk_prices(conversion_rate):
    PRICELIST_URL = "https://www.names.co.uk/info/company/price-list"
    response = requests.get(PRICELIST_URL).text

    row_pattern = re.compile(
        r'<tr>.*?<td class="c1">(\..+?)\s.*?<td class="c3">£([\d.]+)</td>.*?</tr>',
        re.DOTALL,
    )
    matches = row_pattern.findall(response)

    tlds = [match[0] for match in matches]
    prices_gbp = [match[1] for match in matches]
    prices_usd = [round(float(price) * conversion_rate, 2) for price in prices_gbp]

    with open(f"{DATA_PATH}/NamesCoUk.json", "w+") as f:
        json.dump(dict(zip(tlds, prices_usd)), f)

    return "OK"


if __name__ == "__main__":
    conversion_rate = get_gbp_to_usd_rate()
    print(f"Conversion rate: {conversion_rate}")
    print("Namecheap", update_namecheap_prices())
    print("Names.co.uk", update_namescouk_prices(conversion_rate))
