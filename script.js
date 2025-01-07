const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const button = document.getElementById("capture");

// Access user's camera
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => (video.srcObject = stream));

button.addEventListener("click", async () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const image = canvas.toDataURL("image/png");
  const location = await getLocation();

  // Send to backend
  fetch("http://localhost:5000/capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image, location }),
  })
    .then((response) => response.json())
    .then((data) => data.message)
    .catch((error) => console.error(error));
});

// Get user's location
function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (error) => reject(error)
    );
  });
}
