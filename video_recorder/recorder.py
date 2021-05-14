from picamera import PiCamera
from time import sleep
camera = PiCamera()
import datetime
import sys
path = sys.argv[1]
start_date = datetime.datetime.now()
interval = 60
fps = 10
while True:
    print(start_date.strftime('%m-%d %H:%M:%S'))
    camera.start_recording('{}/videos/{}.h264'.format(path, start_date.strftime('%m-%d %H:%M:%S')))
    camera.wait_recording(interval)
    start_date = datetime.datetime.now()
    camera.stop_recording()







