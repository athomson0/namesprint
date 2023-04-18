import re
from registrars.BaseRegistrar import BaseRegistrar
from collections import defaultdict
from dataclasses import dataclass, field, asdict
from typing import List
from const import MAXIMUM_NAME_LENGTH, TLDS, COMMON_WORDS_DATASET


@dataclass
class Domain:
    name: str
    tld: str
    priority: float
    show_price: float
    is_domain_hack: bool = False
    domain_name: str = field(init=False)
    purchase_links: dict = field(default_factory=dict, init=False)
    registrars: List[BaseRegistrar] = field(init=False)
    cheapest_price: float = field(init=False)
    currency: str = field(init=False)

    def __post_init__(self):
        self.domain_name = self.name + self.tld
        self.priority = TLDS[self.tld]["priority"]
        self.registrars = [registrar for registrar in TLDS[self.tld]["registrars"]]
        self.purchase_links = {
            registrar.name: {
                "name": registrar.name,
                "url": registrar.generate_purchase_link(self.name, self.tld),
                "price": registrar.get_price(self.tld),
                "currency": registrar.currency,
            }
            for registrar in self.registrars
        }
        self.update_cheapest_price()
        self.currency = self.registrars[0].currency if self.registrars else None

    def update_cheapest_price(self):
        prices = [
            link["price"]
            for link in self.purchase_links.values()
            if link["price"] is not None
        ]
        self.cheapest_price = min(prices) if prices else None

    def to_dict(self):
        domain_dict = asdict(self)
        domain_dict.pop("registrars")
        domain_dict["purchase_links"] = list(self.purchase_links.values())
        return domain_dict


def normalise_name(name):
    name = re.sub(r"\.[^.]+$", "", name)
    name = re.sub(r"[^a-zA-Z0-9]+", "-", name)
    name = name.rstrip("-")
    name = name[:MAXIMUM_NAME_LENGTH]
    return name.lower()


def generate_domains(name):
    """
    Generate a list of Domain objects for a given string.

    Also checks for "domain hacks" - e.g. the string "become"
    could be formed using the .me TLD: beco.me
    """

    def is_common_word(name):
        return name in COMMON_WORDS_DATASET

    def get_domains(name, show_price):
        return [
            Domain(name, tld, tld_info["priority"], show_price)
            for tld, tld_info in TLDS.items()
        ]

    def get_domain_hacks(name, show_price):
        domain_hacks = []
        for tld in TLDS.keys():
            if name.endswith(tld[1:]) and len(name) > len(tld[1:]):
                name = name[: -len(tld) + 1]
                domain_hack = name + tld
                priority = 1
                domain_hacks.append(
                    Domain(name, tld, priority, show_price, is_domain_hack=True)
                )
        return domain_hacks

    show_price = not is_common_word(name)
    domains = get_domains(name, show_price)
    domain_hacks = get_domain_hacks(name, show_price)

    return domains + domain_hacks


def sort_domain_list(domain_list):
    return sorted(domain_list, key=lambda domain: domain.priority)
