/*
 * Copyright 2025 NutriTrack
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Close, PhotoCamera } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import Webcam from "react-webcam";

function CameraDialog({
  isCameraOpen,
  startCamera,
  stopCamera,
  handleCameraError,
  cameraError,
  webcamRef,
  captureImage,
}: any) {
  return (
    <Dialog
      open={isCameraOpen}
      onClose={stopCamera}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "rounded-2xl",
      }}
    >
      <DialogTitle className="flex items-center justify-between">
        <span className="font-semibold">Take a Photo of Your Food</span>
        <IconButton onClick={stopCamera} className="text-gray-500">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent className="p-6">
        <div className="relative">
          {cameraError ? (
            <div className="text-center p-8">
              <div className="text-red-500 mb-4">📷</div>
              <p className="text-red-600 mb-4">{cameraError}</p>
              <Button
                onClick={startCamera}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: { ideal: "environment" },
                width: { ideal: 1280, max: 1920 },
                height: { ideal: 720, max: 1080 },
              }}
              onUserMediaError={handleCameraError}
              className="w-full rounded-lg"
              style={{ maxHeight: "400px" }}
            />
          )}

          {!cameraError && (
            <div className="flex justify-center mt-6 gap-4">
              <Button
                onClick={stopCamera}
                className="border-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={captureImage}
                startIcon={<PhotoCamera />}
                className="bg-green-600 hover:bg-green-700"
                size="large"
              >
                Capture Photo
              </Button>
            </div>
          )}

          {!cameraError && (
            <p className="text-center text-gray-500 mt-4">
              Position your food in the center of the frame for best results
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CameraDialog;
