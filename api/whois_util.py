import re
import whois
from concurrent.futures import ThreadPoolExecutor, as_completed, TimeoutError
from apscheduler.schedulers.background import BackgroundScheduler
from threading import RLock
from const import TLDS, DOMAIN_CHECK_TIMEOUT, MAX_THREADS, JOB_TTL
from job_manager import jobs

# If a WHOIS response contains one of these strings, then the domain is likely available
AVAILABLE_INDICATORS = [
    r"the queried object does not exist: domain not found",
    # r"domain not found.",
    r"NOT FOUND",
    r"no match",
    r"no data found",
    r"no object found",
    r"status:\s*free",
    r"status:\s*available",
    r"is available",
    r"domain not registered",
    r"no entries found",
    r"status:\s*available",
    r"domain not found",
    r"No_Se_Encontro_El_Objeto",
    r"is free",
]

# If a WHOIS response contains one of these strings, then the domain is likely unavailable
UNAVAILABLE_INDICATORS = [
    r"this name is reserved",
    r"clienttransferprohibited",
    r"client update prohibited",
    r"client delete prohibited",
    r"client renew prohibited",
    r"client hold",
    r"servertransferprohibited",
    r"server update prohibited",
    r"server delete prohibited",
    r"server renew prohibited",
    r"server hold",
    r"renewperiod",
    r"autorenewperiod",
    r"transferprohibited",
    r"updateprohibited",
    r"deleteprohibited",
    r"renewprohibited",
    r"not disclosed!",
    r"created on:",
    r"the registration of this domain is restricted",
]

# Maybe hit a rate limit for a specific whois server?
UNKNOWN_INDICATORS = [
    r"You exceeded the maximum allowable number of whois lookups",
    r"This TLD has no whois server",
]


def parse_whois_output(output):
    output = output.lower()

    for available_token in AVAILABLE_INDICATORS:
        if re.search(available_token, output, re.IGNORECASE):
            return True
    for indicator in UNAVAILABLE_INDICATORS:
        if re.search(indicator, output, re.IGNORECASE):
            return False
    return False


def check_single_domain_availability(domain):
    domain_name = domain.domain_name
    try:
        flags = 0 | whois.NICClient.WHOIS_QUICK
        w = whois.whois(domain_name, flags=flags, quiet=True)

        if "use_tokens" in TLDS[domain.tld].keys():
            return parse_whois_output(w.text)
        elif w.status is None:
            return True
    except whois.parser.PywhoisError as e:
        return parse_whois_output(str(e))
    except Exception as e:
        print(f"Error checking domain {domain_name}: {e}")
        return False


def check_domain_availability(job_id, name):
    with ThreadPoolExecutor(max_workers=MAX_THREADS) as executor:
        job = jobs[job_id]
        domains = job["unknown_domains"]
        futures = {
            executor.submit(check_single_domain_availability, d): d for d in domains
        }

        for future in as_completed(futures):
            domain = futures[future]
            try:
                available_domain = future.result(DOMAIN_CHECK_TIMEOUT)
                job["unknown_domains"].remove(domain)
                if available_domain:
                    job["available_domains"].append(domain)
                else:
                    job["unavailable_domains"].append(domain)
            except TimeoutError:
                print(f"Timed out checking domain {domain.domain_name}")
            except Exception as e:
                print(f"Error checking domain {domain.domain_name}: {e}")
        job["status"] = "finished"
