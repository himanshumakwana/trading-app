import schedule
import time
import pytz
import datetime
from nsepythonserver import *
from sqlite import OptionChainNifty

ist = pytz.timezone('Asia/Kolkata')  # IST timezone

now = datetime.datetime.now(tz=pytz.utc)  # Get current UTC time
ist_now = now.astimezone(ist)  # Convert to IST


print("starting cron", ist_now)

def job():
    print("coming here")
    index = "NIFTY"
    url = f'https://www.nseindia.com/api/option-chain-indices?symbol={index}'
    print(url)
    # response = requests.get(url, headers = headers)
    data = nsefetch(url)
    
    expDates = data['records']['expiryDates']
    spot = data['records']['underlyingValue']
    ce_total_oi = data['filtered']['CE']['totOI']
    pe_total_oi = data['filtered']['PE']['totOI']

    # Iterate over expiry dates
    for expDate in expDates:
        ch = [stk for stk in data['records']['data'] if stk['expiryDate'] == expDate]
        
        # Iterate over data for each expiry date
        for stks in ch:
            if 'CE' in stks and 'PE' in stks:
            
                adjustment = round(stks['strikePrice'] - (spot - (stks['CE']['lastPrice'] - stks['PE']['lastPrice'])), 2)

                # Create a record in the database
                OptionChainNifty.create(
                    expiry_dates=expDate,
                    strike_price=stks['strikePrice'],
                    ce_io=stks['CE']['openInterest'],
                    ce_chng_in_io=stks['CE']['changeinOpenInterest'],
                    ce_ltp=stks['CE']['lastPrice'],
                    pe_io=stks['PE']['openInterest'],
                    pe_chng_in_io=stks['PE']['changeinOpenInterest'],
                    pe_ltp=stks['PE']['lastPrice'],
                    ltp_diff=stks['PE']['lastPrice'] - stks['CE']['lastPrice'],
                    adjustment=adjustment,
                    chng_in_oi_diff=stks['CE']['changeinOpenInterest'] - stks['PE']['changeinOpenInterest'],
                    chng_in_oi_pcr=pe_total_oi / ce_total_oi if ce_total_oi != 0 else pe_total_oi,
                    pcr=stks['PE']['openInterest'] / stks['CE']['openInterest'] if stks['CE']['openInterest'] != 0 else stks['PE']['openInterest'],
                    ce_total_oi=ce_total_oi,
                    pe_total_oi=pe_total_oi,
                    total_pcr=pe_total_oi / ce_total_oi if ce_total_oi != 0 else pe_total_oi,
                    json_res="nothing is here as of now"
                )


# Schedule job to run every 3 minutes from 9am to 3pm on weekdays (Monday to Friday)
# start_time = "09:00"
# end_time = "15:30"

# Convert start and end times to datetime objects
# start_hr, start_min = map(int, start_time.split(':'))
# end_hr, end_min = map(int, end_time.split(':'))

# Loop through the hours and schedule the job
# for hour in range(start_hr, end_hr):
    # for minute in range(0, 60, 3):  # Run every 3 minutes
        # Check if the day is not Saturday (5) or Sunday (6)
        # if datetime.datetime.now().weekday() not in [5, 6]:
            # schedule.every().day.at(f"{hour:02}:{minute:02}").do(job)

# start_time = "00:00"
# end_time = "23:59"

# Convert start and end times to datetime objects
# start_hr, start_min = map(int, start_time.split(':'))
# end_hr, end_min = map(int, end_time.split(':'))

# Loop through the hours and schedule the job
# for hour in range(start_hr, end_hr):
#     for minute in range(0, 60, 1):  # Run every 3 minutes
        # Schedule job only if it's not Saturday (5) or Sunday (6)
#         if ist_now.weekday() not in [5, 6]:
#             print(hour, minute)

# 	    schedule_time = ist_now.replace(hour=hour, minute=minute, second=0, microsecond=0)
#             schedule.every().day.at(schedule_time.strftime("%H:%M")).do(job)


start_time = "09:00"
end_time = "15:33"

# Convert start and end times to datetime objects
start_hr, start_min = map(int, start_time.split(':'))
end_hr, end_min = map(int, end_time.split(':'))

# Loop through the hours and schedule the job
for hour in range(start_hr, end_hr):
    for minute in range(0, 60, 3):  # Run every 3 minutes
        # Schedule job only if it's not Saturday (5) or Sunday (6)
        if ist_now.weekday() not in [5, 6]:            
            schedule_time = ist_now.replace(hour=hour, minute=minute, second=0, microsecond=0)
            schedule.every().day.at(schedule_time.strftime("%H:%M")).do(job)



# Run the scheduler
while True:
    schedule.run_pending()
    time.sleep(1)


# Run the scheduler
while True:
    schedule.run_pending()
    time.sleep(1)
