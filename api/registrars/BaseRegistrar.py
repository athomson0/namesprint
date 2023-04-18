from dataclasses import dataclass, field
import json
import os

DATA_PATH = f"{os.path.dirname(os.path.realpath(__file__))}/data"


@dataclass
class BaseRegistrar:
    name: str = field(default=None)
    currency: str = field(default="USD")
    _DEFAULT_PRICE: float = field(init=False, default=4.99)
    _REFERRAL_CODE: str = field(init=False, default=None)
    _PRICE_MAP: dict = field(init=False, default_factory=dict)

    def get_price(self, tld: str) -> float:
        if tld in self._PRICE_MAP.keys():
            return self._PRICE_MAP[tld]

        return self._DEFAULT_PRICE

    def generate_purchase_link(self, name: str, tld: str) -> str:
        raise NotImplementedError("Subclasses must implement this method!")

    def __post_init__(self):
        with open(f"{DATA_PATH}/{self.name}.json") as f:
            self._PRICE_MAP = json.load(f)
