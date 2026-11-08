.PHONY: install build start

install:
	npm ci

build:
	npm run build

start:
	npx start-server -s ./dist