#include "opencv2/opencv.hpp"
#include <iostream>
#include <string>
using namespace std;
using namespace cv;

int main(){

  // Create a VideoCapture object and use camera to capture the video
  VideoCapture cap(0); 

  // Check if camera opened successfully
  if(!cap.isOpened()){
   	cout << "Error opening video stream" << endl;
        return -1;
  }
  
  // Default resolutions of the frame are obtained.The default resolutions are system dependent.
  int frame_width = cap.get(cv::CAP_PROP_FRAME_WIDTH);
  int frame_height = cap.get(cv::CAP_PROP_FRAME_HEIGHT);
  
  // Define the codec and create VideoWriter object.The output is stored in 'outcpp.avi' file.
  VideoWriter video("outcpp.avi", cv::VideoWriter::fourcc('M','J','P','G'), 10, Size(frame_width,frame_height));
  int m = 0;
  while(1){
    m+=1;
    if (m > 100) {
    break;

    }
    Mat frame;
   
    // Capture frame-by-frame
    cap >> frame;
 
    // If the frame is empty, break immediately
    if (frame.empty())
      break;
    
    // Write the frame into the file 'outcpp.avi'
    video.write(frame);
 
    // Press  ESC on keyboard to  exit

  }
  video.release();
VideoWriter video2("outcpp2.avi", cv::VideoWriter::fourcc('M','J','P','G'), 15, Size(frame_width,frame_height));
int c = 0;
int i = 0;
int l = 10;
string num[] = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9"};
while(1){

   Mat frame;

    // Capture frame-by-frame
    cap >> frame;

    // If the frame is empty, break immediately
    if (frame.empty())
      break;
    // Write the frame into the file 'outcpp.avi'

    video2.write(frame);

    // Press  ESC on keyboard to  exit

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
  // When everything done, release the video capture and write object
  cap.release();
  video2.release();

  // Closes all the frames
  
  return 0;
}
