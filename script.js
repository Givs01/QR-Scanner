        const video = document.getElementById('video');
        const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxRANWgQcdTjTwHQBrZy9vfAoIMIjhXEYijk6M-WklHkQjLp0-UVWuiBK_6rWEtdUR1/exec';

        let scanner;
        let cameras = [];
        let currentCameraIndex = 0;

        function startScanner() {
            scanner = new Instascan.Scanner({ video: video, mirror: false });

            scanner.addListener('scan', function (content) {
                scanner.stop();
                alert('QR Code Content: ' + content);
                recordCheckInOut(content);
                setTimeout(function () {
                    startScanner();
                }, 1000);
            });

            scanner.start(cameras[currentCameraIndex]);
        }

        function recordCheckInOut(guestName) {
            const checkType = "Registered";

            fetch(`${WEB_APP_URL}?guestName=${guestName}&checkType=${checkType}`)
                .then(response => response.text())
                .then(result => {
                    console.log('Data added successfully:', result);
                })
                .catch(error => {
                    console.error('Error adding data:', error);
                });
        }

        function switchCamera() {
            currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
            scanner.stop();
            startScanner();
        }

        document.addEventListener('DOMContentLoaded', function () {
            Instascan.Camera.getCameras().then(cameraList => {
                cameras = cameraList;
                if (cameras.length > 0) {
                    startScanner();
                } else {
                    console.error('No cameras found.');
                }
            }).catch(err => {
                console.error(err);
            });
        });
