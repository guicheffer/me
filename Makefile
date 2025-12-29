.PHONY: start

# Load environment variables from .env if it exists
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# Default port if not set in .env
PORT ?= 3000

start:
	@echo "Starting http-serve on port $(PORT)..."
	@npx http-serve ./src -p $(PORT) -P ./src/404.html
