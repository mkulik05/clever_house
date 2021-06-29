#include "opencv2/opencv.hpp"
#include <iostream>
#include <string>
#include <ctime>
#include <chrono>
#include <unistd.h>
using namespace std;
using namespace cv;

// g++ recorder.cpp  -o rec `pkg-config --cflags --libs opencv`

string vid_path = "/home/pi/";
string photos_path = "/mnt/tmpfs-folder/";
int photos = 100;


int rec(VideoWriter video, VideoCapture cap, auto before, int seconds)
{

  cout << "Recording" << endl;
  using clock = std::chrono::system_clock;
  using sec = std::chrono::duration<double>;
  int n = 0;

  while (true)
  {

    Mat frame;
    cap >> frame;

    if (frame.empty())
      break;

    video.write(frame);
    sec duration = clock::now() - before;

    if (n % 3 == 0) {
     imwrite(photos_path + "img" + to_string(n) + ".jpg", frame);
    }

    if (n > photos) {

        unlink((photos_path + "img" + to_string(n - photos) + ".jpg").c_str());
    }
    if (duration.count() > seconds)
    {
      break;
    }
    n += 1;
  }
  return 0;
}

int main()
{
  using clock = std::chrono::system_clock;
  using sec = std::chrono::duration<double>;
  time_t tmNow;
  VideoCapture cap(0);
  if (!cap.isOpened())
  {
    cout << "Error opening video stream" << endl;
    return -1;
  }

  int frame_width = cap.get(cv::CAP_PROP_FRAME_WIDTH);
  int frame_height = cap.get(cv::CAP_PROP_FRAME_HEIGHT);

  while (1)
  {
    tmNow = time(NULL);
    struct tm t = *localtime(&tmNow);
    string day = to_string(t.tm_mday);
    string month = to_string(t.tm_mon);
    string hours = to_string(t.tm_hour);
    string minutes = to_string(t.tm_min);
    string seconds = to_string(t.tm_sec);
    string res = (t.tm_mday < 10 ? "0" + day : day) + "-" + (t.tm_mon < 10 ? "0" + month : month) + "-" + to_string(t.tm_year + 1900) +
                 " " + (t.tm_hour < 10 ? "0" + hours : hours) + ":" + (t.tm_min < 10 ? "0" + minutes : minutes) + ":" + (t.tm_sec < 10 ? "0" + seconds : seconds);
    VideoWriter video(vid_path + res + ".avi", cv::VideoWriter::fourcc('M', 'J', 'P', 'G'), 7, Size(frame_width, frame_height));
    const auto before = clock::now();
    rec(video, cap, before, 5 * 60);
    video.release();
  }

  return 0;
}
