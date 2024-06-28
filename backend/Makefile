
start:
	gunicorn -w 4 main:app --bind 0.0.0.0:4000 --daemon

cron:
	nohup python3 cron.py > cron.log 2>&1 &

dev:
	python3 main.py