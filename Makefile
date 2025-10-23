.PHONY: up down unit-test functional-test build logs

SHELL := /bin/bash

up:
	./scripts/up.sh

down:
	./scripts/down.sh

unit-test:
	./scripts/unit-test.sh

functional-test:
	./scripts/functional-test.sh

build:
	./scripts/build.sh

logs:
	./scripts/logs.sh
