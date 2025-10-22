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
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import type Webcam from "react-webcam";

function useCamera() {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const startCamera = () => {
    console.log("Starting camera...");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const errorMessage = "Camera is not supported in this browser.";
      setCameraError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      const errorMessage =
        "Camera access requires HTTPS. Please use 'Select from Device' instead.";
      setCameraError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setCameraError(null);
    setIsCameraOpen(true);
  };

  const stopCamera = () => {
    console.log("Stopping camera...");
    setCameraError(null);
    setIsCameraOpen(false);
  };

  const handleCameraError = (error: string | DOMException) => {
    console.error("Camera error:", error);
    let errorMessage = "Camera access failed. ";

    if (typeof error === "string") {
      errorMessage += error;
    } else if (error.name === "NotAllowedError") {
      errorMessage += "Please allow camera permissions and try again.";
    } else if (error.name === "NotFoundError") {
      errorMessage += "No camera found on this device.";
    } else if (error.name === "NotReadableError") {
      errorMessage += "Camera is being used by another application.";
    } else if (error.name === "OverconstrainedError") {
      errorMessage += "Camera doesn't support the requested settings.";
    } else {
      errorMessage += "Please check your camera permissions and try again.";
    }

    setCameraError(errorMessage);
    toast.error(errorMessage);
    setIsCameraOpen(false);
  };

  return {
    cameraError,
    isCameraOpen,
    webcamRef,
    startCamera,
    stopCamera,
    handleCameraError,
  };
}

export default useCamera;
