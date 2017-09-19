const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// need to grab video feed from users' devices
function getVideo() {
  // prompts user to allow access to media
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  // returns a promise if prompt is accepted
  .then(localMediaStream => {
    // console.log(localMediaStream)
    // cuz a video source has to be a url, and it's currently just data
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play();
  })
  .catch(err => {
    console.error('Oh shit!', err);
  });
}

// video feed is piped in, now we need to paint a frame of our video onto our canvas

function paintToCanvas() {
  // here we make it so that the canvas is the same size as the video coming in
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with em
    // pixels = redEffect(pixels);
    pixels = rgbSplit(pixels);
    // ghostin'
    ctx.globalAlpha = 0.5;
    // put em back in
    ctx.putImageData(pixels, 0, 0);
  }, 50);
  // ^ this would be 20fps which is perfectly fine, even though the suggested was ever 16ms
}

function takePhoto() {
  // got audio working
  snap.currentTime = 0;
  snap.play();
  // take data out of the canvas as a text/data based representation of the photo
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'wildin');
  link.innerHTML = `<img src="${data}" alt="skrait wildin" />`
  strip.insertBefore(link, strip.firstChild);
}

// filters work by removing the pixels from the cavas, messing with them, and then putting them back in.
function redEffect(pixels) {
  // using a for method instead of map because this type of array doesn't support map
  // look below to see why we increment by 4 instead of by 1
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //r
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //g
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //b
    // don't need to mess with alpha for whatever reason
    // i had "return pixels here" which would stop the for loop after the first iteration
    // and that was fucking up the function
  }
  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    // iterating over each pixel and spacing the r g and b values to separate pixels
    pixels.data[i - 150] = pixels.data[i + 0]; //r
    pixels.data[i + 500] = pixels.data[i + 1]; //g
    pixels.data[i - 550] = pixels.data[i + 2]; //b
    // don't need to mess with alpha for whatever reason
    // i had "return pixels here" which would stop the for loop after the first iteration
    // and that was fucking up the function
  }
  return pixels;
}

// i took out greenScreen function cuz it's a bit above my pay grade.

// function greenScreen(pixels) {
//   // start with blank levels
//   const levels = {};
//   // grabbing all of the inputs inside the rgb div
//   document.querySelectorAll('.rgb input').forEach((input) => {
//     levels[input.name] =input.value;
//   });
// }

getVideo();
video.addEventListener('canplay', paintToCanvas);
