build_docker_dev:
	docker build -t makeadle-web-dev:latest .
	docker tag makeadle-web-dev:latest derwin334/makeadle-web-dev:latest
	docker push derwin334/makeadle-web-dev:latest
