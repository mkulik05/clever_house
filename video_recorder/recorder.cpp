#include "opencv2/opencv.hpp"
#include <iostream>
#include <string>
#include <ctime>
#include <unistd.h>
#include <iomanip>
#include <thread>
#include <unistd.h>
using namespace std;
using namespace cv;

// g++ recorder.cpp  -o rec `pkg-config --cflags --libs opencv`

string vid_path = "/home/pi/Videos/";
string photos_path = "/mnt/tmpfs-folder/";
int photos = 100;

inline string get_time(string format)
{
  auto t = time(nullptr);
  auto tm = *localtime(&t);
  ostringstream date;
  date << put_time(&tm, format.c_str());
  auto str = date.str();
  return str;
}

int rec(VideoWriter video, VideoCapture cap, int frames)
{
  using namespace chrono;
  cout << "Recording" << endl;
  int n = 0;
  int i = 0;
  auto epoch = high_resolution_clock::from_time_t(0);
  while (true) {
  
    auto start = duration_cast<milliseconds>(high_resolution_clock::now() - epoch).count();
    Mat frame;
    cap >> frame;
    flip(frame, frame, -1);
    if (frame.empty())
      break;

    if (n % 3 == 0)
    {
      imwrite(photos_path + "img" + to_string(n) + ".jpg", frame);
    }

    if (n > photos)
    {
      unlink((photos_path + "img" + to_string(n - photos) + ".jpg").c_str());
    }

    string res = get_time("%d-%m-%Y %H-%M-%S");
    putText(frame, res, Point(10, 25), FONT_HERSHEY_SIMPLEX, 0.9, Scalar(0, 0, 255), 2);
    video.write(frame);
    auto end = duration_cast<milliseconds>(high_resolution_clock::now() - epoch).count();
    if (end - start < 100) {
      usleep((100 - (end - start)) * 1000);
    }
    i+=1;
    if (i >= frames)
    {
      break;
    }

    n += 1;
  }
  return 0;
}

void vid_release(VideoWriter video)
{
  video.release();
}

int main()
{
  VideoCapture cap(0);
  cap.set(3, 960);
  cap.set(4, 720);
  if (!cap.isOpened())
  {
    cout << "Error opening video stream" << endl;
    return -1;
  }

  int frame_width = cap.get(cv::CAP_PROP_FRAME_WIDTH);
  int frame_height = cap.get(cv::CAP_PROP_FRAME_HEIGHT);
  while (1)
  {
    string res = get_time("%d-%m-%Y_%H-%M-%S");
    VideoWriter video(vid_path + res + ".mkv", VideoWriter::fourcc('H', '2', '6', '4'), 10, Size(frame_width, frame_height));
    rec(video, cap, 5 * 60 * 10);

    cout << "TEST" << endl;
    // video.release();
    thread th(vid_release, video);
    th.detach();
  }

  return 0;
}
