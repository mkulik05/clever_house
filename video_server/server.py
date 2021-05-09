from flask import Flask, render_template, Response
from camera import VideoCamera
from flask_cors import CORS
import cv2
import datetime

interval = 10
size = (640, 480)
fps = 8


app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
def gen(camera):
    start_date = datetime.datetime.now()
    while True:
        print(start_date.strftime('%m-%d %H:%M'))
        videoWriter = cv2.VideoWriter('{}.avi'.format(start_date.strftime('%m-%d %H:%M:%S')), 
            cv2.VideoWriter_fourcc('I','4','2','0'), fps, size)
        while True:
            frame, jpeg = camera.get_frame()
            delta = divmod((datetime.datetime.now() - start_date).total_seconds(), 60)
            if delta[0] > interval:
                start_date = datetime.datetime.now()
                break
            videoWriter.write(frame)
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + jpeg + b'\r\n\r\n')

@app.route('/video')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen(VideoCamera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
if __name__ == '__main__':
    app.run(host='10.8.0.1',port='5000', debug=True)