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
    console.log(localMediaStream);
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
  }, 20);
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

getVideo();
video.addEventListener('canplay', paintToCanvas);
