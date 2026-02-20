.PHONY: dist clean

.DEFAULT_GOAL := dist

dist:
	tsc -p tsconfig.json

clean:
	rm -rf dist/
