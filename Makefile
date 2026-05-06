.PHONY: start dev stop build

# Load environment variables from .env if it exists
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# Default port if not set in .env
PORT ?= 3000

# Run local dev server (no browser open — use `make dev` for that)
start:
	@echo "Starting http-serve on port $(PORT)..."
	@npx http-serve ./src -p $(PORT) -P ./src/404.html

# Run local dev server and open browser
dev:
	@echo "Opening http://localhost:$(PORT)..."
	@open http://localhost:$(PORT) &
	@npx http-serve ./src -p $(PORT) -P ./src/404.html

# Stop any running local dev server on PORT
stop:
	@echo "Stopping http-serve on port $(PORT)..."
	@lsof -ti tcp:$(PORT) | xargs kill -9 2>/dev/null || echo "Nothing running on port $(PORT)"

# Build minified production output into dist/
# Minifies all HTML, CSS, and JS from src/ into dist/
build:
	@echo "Building production dist/..."
	@rm -rf dist && mkdir -p dist
	@cp -r src/. dist/
	@echo "  Minifying CSS..."
	@npx clean-css-cli dist/style.css -o dist/style.css
	@echo "  Minifying JS..."
	@npx terser dist/script.js -o dist/script.js --compress --mangle
	@echo "  Minifying HTML (index)..."
	@npx html-minifier-terser --collapse-whitespace --remove-comments --minify-css true --minify-js true \
		dist/index.html -o dist/index.html
	@npx html-minifier-terser --collapse-whitespace --remove-comments --minify-css true --minify-js true \
		dist/skills/index.html -o dist/skills/index.html
	@npx html-minifier-terser --collapse-whitespace --remove-comments --minify-css true --minify-js true \
		dist/consulting/index.html -o dist/consulting/index.html
	@npx html-minifier-terser --collapse-whitespace --remove-comments --minify-css true --minify-js true \
		dist/consulting/pricing/index.html -o dist/consulting/pricing/index.html
	@npx html-minifier-terser --collapse-whitespace --remove-comments --minify-css true --minify-js true \
		dist/404.html -o dist/404.html
	@echo "Done! Production files in dist/"
