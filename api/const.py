import os
from spacy import load as spacy_load
from tlds import TLDS_WITH_PRIORITY
from registrars.DummyRegistrar import DummyRegistrar
from registrars.NameCheap import NameCheap
from registrars.NamesCoUk import NamesCoUk

# Maximum number of threads to use in the thread pool when performing WHOIS lookups
MAX_THREADS = 50

# Timeout for each domain check
DOMAIN_CHECK_TIMEOUT = 5

# Maximum length for a domain name candidate
MAXIMUM_NAME_LENGTH = 20

# Minimum length for a domain name candidate
MINIMUM_NAME_LENGTH = 2

# Time-to-live for each job in seconds
# Also used to determine how long to cache WHOIS checks for
JOB_TTL = 3600

# Instantiate registrars
REGISTRARS = [NameCheap()]

# If a domain name candidate matches any of these, don't show the price,
# since it'll likely be a lot more expensive than what we have cached
COMMON_WORDS_DATASET = set()

# Common words - if a query matches one of these then don't show the price,
# since it'll probably be a lot higher than what we have cached.
with open(f"{os.path.dirname(os.path.realpath(__file__))}/data/common_words", "r") as f:
    words = {word.strip().lower() for word in f.readlines()}
common_company_names = {"google", "microsoft", "apple", "amazon", "facebook"}
COMMON_WORDS_DATASET = words | common_company_names

# List of TLDS along with priority/registrars who supply them
TLDS = {
    tld: {
        **TLDS_WITH_PRIORITY[tld],
        "registrars": [
            registrar for registrar in REGISTRARS if tld in registrar._PRICE_MAP.keys()
        ],
    }
    for tld in TLDS_WITH_PRIORITY
}

# The NLP model to determine whether or not a question was asked
NLP = spacy_load("en_core_web_sm")

# OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

AI_PROMPT = "You are to act as a domain name generator. Provide 20  unique, modern, catchy and memorable company name suggestions. Suggestions should be formatted as: a comma-separated list, with each item matching the following regular expression: `[a-zA-Z0-9-]+`. \
             Suggestions should not include a TLD. Base your response on the following input: "
