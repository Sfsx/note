let con = document.getElementById('viewerContainer')
// let canvas = con.children[0].children[0].children[0]

let allChunks = [];
let canvas = document.getElementById("animate");
let stream = canvas.captureStream(60); // 60 FPS recording
let recorder = new MediaRecorder(stream, {
  videoBitsPerSecond: 8500000,
  mimeType: "video/webm",
});
// canvas 录制回调
recorder.ondataavailable = (e) => {
  console.log('1111')
  allChunks.push(e.data);
};
// 开始
recorder.start();
// 停止
recorder.stop();

let videoBlob = new Blob(allChunks, { 'type' : 'video/mp4' })
videoUrl = window.URL.createObjectURL(videoBlob)