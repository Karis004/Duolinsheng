import schedule
import time
import threading
import review


schedule.every().day.at("22:00").do(review.send_reminder)
def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)
        
        
if __name__ == '__main__':
    scheduler_thread = threading.Thread(target=run_scheduler)
    scheduler_thread.start()
    