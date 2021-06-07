#include "opencv2/opencv.hpp"
#include <iostream>
#include <string>
using namespace std;
using namespace cv;


// g++ recorder.cpp  -o rec `pkg-config --cflags --libs opencv`

int main(){

  VideoCapture cap(0); 


  if(!cap.isOpened()){
   	cout << "Error opening video stream" << endl;
        return -1;
  }
  

  int frame_width = cap.get(cv::CAP_PROP_FRAME_WIDTH);
  int frame_height = cap.get(cv::CAP_PROP_FRAME_HEIGHT);
  

  VideoWriter video("outcpp.avi", cv::VideoWriter::fourcc('M','J','P','G'), 10, Size(frame_width,frame_height));
  int m = 0;
  while(1){
    m+=1;
    if (m > 100) {
    break;

    }
    Mat frame;
   
  
    cap >> frame;
 
  
    if (frame.empty())
      break;
    
    video.write(frame);
 
   

  }
  video.release();
VideoWriter video2("outcpp2.avi", cv::VideoWriter::fourcc('M','J','P','G'), 15, Size(frame_width,frame_height));
int c = 0;
int i = 0;
int l = 10;
string num[] = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9"};
while(1){

   Mat frame;

    cap >> frame;

    
    if (frame.empty())
      break;


    video2.write(frame);

   
    if (c % 3) {
        imwrite("/mnt/tmpfs-folder/raw" +  num[i] + ".jpg", frame);
        if (i > l) {
            i = 0;
        } else {
            i += 1;
        }

    }
     c+=1;
  }
 
  cap.release();
  video2.release();

 
  
  return 0;
}
