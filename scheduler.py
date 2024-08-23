import schedule
import time
import review
import logging

logging.basicConfig(filename='dls.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

schedule.every().day.at("20:00").do(review.send_reminder)
def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)
        
try:
    run_scheduler()
except Exception as e:
    logging.error({f"error: {e}"}, exc_info=True)