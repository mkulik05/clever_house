from flask import Flask, render_template, Response
from camera import VideoCamera
from flask_cors import CORS
import cv2
import datetime

start_date = datetime.datetime.now()
interval = 10
size = (int(cameraCapture.get(cv2.CAP_PROP_FRAME_WIDTH)),
                int(cameraCapture.get(cv2.CAP_PROP_FRAME_HEIGHT)))
fps = 8


app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
def gen(camera):
    while True:
        print(start_date.strftime('%m-%d %H:%M'))
        videoWriter = cv2.VideoWriter('{}.avi'.format(start_date.strftime('%m-%d %H:%M:%S')), 
            cv2.VideoWriter_fourcc('I','4','2','0'), fps, size)
        
        frame = camera.get_frame()

        while True:
            delta = divmod((datetime.datetime.now() - start_date).total_seconds(), 60)
            if delta[0] > interval:
                start_date = datetime.datetime.now()
                break
            videoWriter.write(frame)
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/video')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen(VideoCamera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
if __name__ == '__main__':
    app.run(host='10.8.0.1',port='5000', debug=True)


while True:
    print(start_date.strftime('%m-%d %H:%M'))
    videoWriter = cv2.VideoWriter('{}.avi'.format(start_date.strftime('%m-%d %H:%M:%S')), 
        cv2.VideoWriter_fourcc('I','4','2','0'), fps, size)
    
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
    

cameraCapture.release()