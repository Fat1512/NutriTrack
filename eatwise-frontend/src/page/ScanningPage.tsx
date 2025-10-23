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
import { Box } from "@mui/material";
import DetectionForm from "../feature/food-scanning/DetectionForm";

const ScanningPage = () => {
  return (
    <>
      <Box className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <DetectionForm />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h2 className="font-semibold mb-2">AI Detection</h2>
              <h2 className="text-gray-600">
                Advanced AI identifies nutritions in your food automatically
              </h2>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="font-semibold mb-2">Nutrition Facts</h2>
              <h2 className="text-gray-600">
                Get detailed calorie, macro, and micronutrient information
              </h2>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default ScanningPage;
