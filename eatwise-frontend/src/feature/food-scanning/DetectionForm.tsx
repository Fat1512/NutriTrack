import React, { useState, useCallback } from "react";
import { Button, CircularProgress } from "@mui/material";
import { CloudUpload, Camera, RestaurantMenu } from "@mui/icons-material";
import { toast } from "react-toastify";
import useDetectNutrition from "./useDetectNutrition";
import type { ScanResult } from "../../types/scanning";
import NutritionResults from "./NutritionResults";
import useCamera from "./useCamera";
import CameraDialog from "./CameraDialog";

function DetectionForm() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const { isLoading, detectNutrition } = useDetectNutrition();

  const {
    cameraError,
    isCameraOpen,
    webcamRef,
    startCamera,
    stopCamera,
    handleCameraError,
  } = useCamera();

  const captureImage = useCallback(() => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "camera-capture.jpg", {
          type: "image/jpeg",
        });
        setSelectedImage(file);
        setImagePreview(imageSrc);
        setScanResult(null);
        stopCamera();
      })
      .catch((err) => {
        console.error("Error converting image:", err);
        toast.error("Failed to capture image. Please try again.");
      });
  }, []);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setScanResult(null);
    }
  };

  const handleScanImage = async () => {
    if (!selectedImage) return;

    try {
      const formData = new FormData();
      formData.append("images", selectedImage);

      const result = await detectNutrition(formData);

      if (result.error) {
        throw new Error("Only food is allowed. Please try again");
      }

      setScanResult(result);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const resetScan = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setScanResult(null);
  };

  if (scanResult) {
    return <NutritionResults data={scanResult} imageUrl={imagePreview} />;
  }

  return (
    <>
      <div className="text-center mb-8">
        <RestaurantMenu className="mx-auto mb-4 text-6xl text-green-600" />
        <p className="text-3xl">Nutrition Detection</p>
        <p className="text-lg">
          Upload an image of your meal and get detailed nutritional information
          instantly
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        {!imagePreview ? (
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 mb-6 hover:border-green-500 transition-colors">
              <CloudUpload className="mx-auto mb-4 text-6xl text-gray-400" />
              <h2 className="mb-2 text-gray-700">
                Choose how to add your food image
              </h2>
              <p className="text-gray-500 mb-6">
                Upload from device or capture with camera
              </p>

              {/* Option Buttons */}
              <div className="flex gap-4 justify-center flex-wrap">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button
                    component="span"
                    startIcon={<CloudUpload />}
                    className="bg-green-600 hover:bg-green-700"
                    size="large"
                  >
                    Select from Device
                  </Button>
                </label>
                <Button
                  onClick={startCamera}
                  startIcon={<Camera />}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  size="large"
                >
                  Use Camera
                </Button>
              </div>

              <p className="text-gray-400 mt-4 block">
                Supported formats: JPG, PNG
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <img
                src={imagePreview}
                alt="Selected food"
                className="max-w-full max-h-96 mx-auto rounded-xl shadow-md"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={resetScan}
                className="border-gray-300 text-gray-700"
              >
                Choose Different Image
              </Button>
              <Button
                onClick={handleScanImage}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
                size="large"
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} className="mr-2" />
                    Analyzing...
                  </>
                ) : (
                  "Scan Food"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      <CameraDialog
        isCameraOpen={isCameraOpen}
        startCamera={startCamera}
        stopCamera={stopCamera}
        handleCameraError={handleCameraError}
        cameraError={cameraError}
        webcamRef={webcamRef}
        captureImage={captureImage}
      />
    </>
  );
}

export default DetectionForm;
