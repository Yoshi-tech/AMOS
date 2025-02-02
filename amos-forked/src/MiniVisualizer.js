import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import "./MiniVisualizer.css";

const ModelPreview = ({ modelPath }) => {
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    if (!modelPath) return;
    const loader = new STLLoader();
    loader.load(modelPath, (geo) => {
      geo.center();
      setGeometry(geo);
    });
  }, [modelPath]);

  return geometry ? (
    <mesh>
      <primitive attach="geometry" object={geometry} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  ) : null;
};

const MiniVisualizer = ({ modelPath }) => {
  return (
    <div className="mini-visualizer-container">
      <Canvas className="mini-visualizer">
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} intensity={1} />
          <OrbitControls enableZoom={false} />
          <ModelPreview modelPath={modelPath} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MiniVisualizer;
