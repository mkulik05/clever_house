import cv2
import datetime
import sys
path = sys.argv[1]
start_date = datetime.datetime.now()
interval = 5
cameraCapture = cv2.VideoCapture(0)
size = (int(cameraCapture.get(cv2.CAP_PROP_FRAME_WIDTH)),
                int(cameraCapture.get(cv2.CAP_PROP_FRAME_HEIGHT)))
fps = 10
while True:
    print(start_date.strftime('%m-%d %H:%M:%S'))
    videoWriter = cv2.VideoWriter('{}/videos/{}.mkv'.format(path, start_date.strftime('%m-%d %H:%M:%S')), 
        cv2.VideoWriter_fourcc('H','2','6','4'), fps, size)

    success, frame = cameraCapture.read()

    while success:
        delta = divmod((datetime.datetime.now() - start_date).total_seconds(), 60)
        if delta[0] > interval:
            start_date = datetime.datetime.now()
            break
        videoWriter.write(frame)
        success, frame = cameraCapture.read()
        if cv2.waitKey(1) == ord("q"):
            break
