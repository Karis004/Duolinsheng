import schedule
import time
import review
import logging

logger = logging.getLogger(__name__)

schedule.every().day.at("22:00").do(review.send_reminder)
def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)
        
try:
    run_scheduler()
except Exception as e:
    logger.error(e, exc_info=True)