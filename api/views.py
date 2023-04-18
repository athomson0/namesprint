import uuid
import os
from hashlib import sha256
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from flask import Blueprint, request, jsonify, abort, redirect
from const import MINIMUM_NAME_LENGTH
from domain import generate_domains, normalise_name
from whois_util import check_domain_availability
from nlp import has_user_asked_question
from ai import generate_name_suggestions
from job_manager import jobs, job_to_dict

api_routes = Blueprint("api_routes", __name__)


@api_routes.route("/query", methods=["POST"])
def search():
    data = request.get_json()
    name = data.get("data")

    if not name:
        return jsonify({"error": "Domain name not provided"}), 400

    domains = []

    # User has asked something like "suggest me a name for my tech company"
    if has_user_asked_question(name[:80]):
        response_type = "suggestion"
        executor = generate_name_suggestions
        print(name)
    # Use has passed in a regular name/domain name
    else:
        response_type = "whois"
        executor = check_domain_availability
        name = normalise_name(name)
        if len(name) < MINIMUM_NAME_LENGTH:
            return jsonify({"error": f"Name too short: {name}"})

        domains = generate_domains(name)

    job_id = str(uuid.uuid4())
    jobs[job_id] = {
        "response_type": response_type,
        "status": "running",
        "available_domains": [],
        "unavailable_domains": [],
        "unknown_domains": domains,
        "suggestions": [],
        "created_at": datetime.now(),
        "error": None,
    }

    ThreadPoolExecutor().submit(executor, job_id, name)

    return jsonify({"job_id": job_id})


@api_routes.route("/jobs", methods=["GET"])
def get_jobs():
    if not os.environ.get("FLASK_DEBUG"):
        return abort(403)
    return jsonify({job_id: job_to_dict(job) for job_id, job in jobs.items()})


@api_routes.route("/job/<job_id>", methods=["GET"])
def job_status(job_id):
    job = jobs.get(job_id)
    if job:
        return jsonify(job_to_dict(job))
    else:
        return jsonify({"error": "Job not found"}), 404


@api_routes.route("/conversion", methods=["GET"])
def convert():
    """TODO"""
    domain_name = request.args.get("domain_name")
    registrar_name = request.args.get("registrar_name")
    price = request.args.get("price")
    registrar_url = request.args.get("registrar_url")
    token = request.args.get("token")

    token_hash = sha256(domain_name.encode("utf-8")).hexdigest()

    if token != token_hash:
        return "Invalid token", 401

    return redirect(registrar_url)
