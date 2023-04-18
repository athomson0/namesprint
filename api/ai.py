import re
import json
import requests
from const import OPENAI_API_KEY, AI_PROMPT
from job_manager import jobs

URL = "https://api.openai.com/v1/chat/completions"
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + OPENAI_API_KEY,
}


def normalise_response(response):
    response = response["choices"][0]["message"]["content"]
    response = re.sub(r"[^a-zA-Z0-9\-,\s]+", "", response)
    response = response.split(", ")

    return response


def generate_name_suggestions(job_id, input):
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": AI_PROMPT + input}],
        "max_tokens": 300,
    }

    job = jobs[job_id]

    try:
        response = requests.post(URL, headers=HEADERS, data=json.dumps(data)).json()
        response = normalise_response(response)

        job["suggestions"] = response
        job["status"] = "finished"
    except Exception as e:
        job["error"] = str(e)
        job["status"] = "finished"
