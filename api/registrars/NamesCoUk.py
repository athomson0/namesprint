from dataclasses import dataclass
from .BaseRegistrar import BaseRegistrar


@dataclass
class NamesCoUk(BaseRegistrar):
    def __post_init__(self):
        self.name = "NamesCoUk"
        self._REFERRAL_CODE = "abcd1234"

        super().__post_init__()

    def generate_purchase_link(self, name: str, tld: str) -> str:
        return f"https://www.names.co.uk/search/domain?domain={name}{tld}"
