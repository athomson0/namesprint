.PHONY: all web api dev stop check_dependencies

all: check_dependencies
	docker-compose build
	docker-compose up -d

web: check_dependencies
	docker-compose build web
	docker-compose up web

api: check_dependencies
	docker-compose build api
	docker-compose up api

dev: check_dependencies
	export NODE_ENV=development
	docker-compose -f docker-compose.dev.yml build
	docker-compose -f docker-compose.dev.yml up

stop:
	docker-compose down --remove-orphans

check_dependencies:
	@command -v docker-compose >/dev/null 2>&1 || { echo >&2 "Docker Compose is not installed. Please install Docker Compose."; exit 1; }
