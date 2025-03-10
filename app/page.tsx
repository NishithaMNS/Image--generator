"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StableBud() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setImage(data.image_url);
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setLoading(false);
  };

  const downloadImage = () => {
    if (image) {
      const link = document.createElement("a");
      link.href = image;
      link.download = "generated_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <motion.h1 
        className="text-4xl font-bold text-white mb-6 text-center" 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        Image Generator
      </motion.h1>
      <Card className="bg-gray-800 p-6 rounded-lg shadow-2xl w-[500px] text-center border border-gray-700">
        <CardContent>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt..."
            className="mb-4 w-full text-white bg-gray-700 border border-gray-500 focus:border-blue-500 p-3 rounded-md"
          />
          <Button 
            onClick={generateImage} 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
          >
            {loading ? "Generating..." : "Generate"}
          </Button>
        </CardContent>
      </Card>
      {image && (
        <motion.div 
          className="mt-6 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-[500px] h-auto flex items-center justify-center border border-gray-700 shadow-lg">
            <CardContent>
              <motion.img
                src={image}
                alt="Generated"
                className="rounded-lg shadow-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </CardContent>
          </Card>
          <Button
  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
  onClick={downloadImage}
>
  Download Image
</Button>

        </motion.div>
      )}
    </div>
  );
}
