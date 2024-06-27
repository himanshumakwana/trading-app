from datetime import datetime, timedelta
# datetime.datetime.now().weekday() not in [5, 6]:
print(datetime.now())

utc_now = datetime.utcnow()

ist_offset = timedelta(hours=5, minutes=30)

# Calculate IST time by adding the offset to UTC time
ist_now = utc_now + ist_offset

print(utc_now)

print(ist_offset)

print(ist_now)

