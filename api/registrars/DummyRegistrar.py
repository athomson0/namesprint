from dataclasses import dataclass
from .BaseRegistrar import BaseRegistrar


@dataclass
class DummyRegistrar(BaseRegistrar):
    def __post_init__(self):
        self.name = "DummyRegistrar"
        self._REFERRAL_CODE = "abcd1234"

        super().__post_init__()

    def generate_purchase_link(self, name: str, tld: str) -> str:
        return f"https://register.dummy.com/{name}{tld}?ref={self._REFERRAL_CODE}"
