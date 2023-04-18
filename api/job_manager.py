import atexit
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from const import JOB_TTL


jobs = {}


def job_to_dict(job):
    return {
        "status": job["status"],
        "available_domains": [domain.to_dict() for domain in job["available_domains"]],
        "unavailable_domains": [
            domain.to_dict() for domain in job["unavailable_domains"]
        ],
        "unknown_domains": [domain.to_dict() for domain in job["unknown_domains"]],
        "created_at": job["created_at"],
        "error": job["error"],
        "suggestions": job["suggestions"],
        "response_type": job["response_type"],
    }


def clear_expired_jobs():
    global jobs
    expired_jobs = []

    for job_id, job in jobs.items():
        if datetime.now() - job["created_at"] > timedelta(seconds=JOB_TTL):
            expired_jobs.append(job_id)

    for job_id in expired_jobs:
        del jobs[job_id]

    if len(expired_jobs) == 0:
        return

    print(f"Cleared {len(expired_jobs)} expired jobs: {', '.join(expired_jobs)}")


scheduler = BackgroundScheduler()
scheduler.add_job(clear_expired_jobs, "interval", seconds=JOB_TTL)
scheduler.start()
atexit.register(lambda: scheduler.shutdown())
