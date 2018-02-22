PKG:=yarn #❤️

DEPLOY:=build:prod
GOURCE:=gource

help:
	@echo
	@echo "✍🏽  Please use 'make <target>' where <target> is one of the commands below:"
	@echo
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e "s/\\$$//" | sed -e "s/##//"
	@echo

# ------------------------------------------------------------------------------------ #

build: ## build locally the files
	$(PKG) build

build-prod: ## build on a prod-version
	$(PKG) $(DEPLOY)

change-version: ## change the project version
	$(PKG) version

clean:
	$(PKG) clean-files

deploy: build-prod

install: ## install missing dependencies
	$(PKG)

pack: ## pack project if needed
	$(PKG) pack

run: ## runs locally on a 3000 port pre-defined on package.json
	$(PKG) run-local

start: ## start development
	$(PKG) start

watch: ## watch what's important to
	$(PKG) watch

gource:
	@echo "No '$(GOURCE)' task was settled up 😞"
