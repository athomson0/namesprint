from dataclasses import dataclass
from .BaseRegistrar import BaseRegistrar


@dataclass
class NameCheap(BaseRegistrar):
    def __post_init__(self):
        self.name = "NameCheap"
        self._REFERRAL_CODE = "abcd1234"

        super().__post_init__()

    def generate_purchase_link(self, name: str, tld: str) -> str:
        return f"https://www.namecheap.com/domains/registration/results/?domain={name}{tld}%26ref={self._REFERRAL_CODE}"
