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
