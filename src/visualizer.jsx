import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";
import { useDrag } from "@use-gesture/react";

const Model = ({ id, position, scale, setPosition }) => {
  const [geometry, setGeometry] = useState(null);
  const meshRef = useRef();

  // ✅ Load STL asynchronously & Fix Rotation
  useEffect(() => {
    const loadSTL = async () => {
      try {
        const loader = new STLLoader();
        const loadedGeometry = await new Promise((resolve, reject) => {
          loader.load("/models/base_model.stl", resolve, undefined, reject);
        });

        loadedGeometry.center(); // Center model
        setGeometry(loadedGeometry);
      } catch (error) {
        console.error("Error loading STL:", error);
      }
    };

    loadSTL();
  }, []);

  // ✅ Rotate the Model to Face Up
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = -Math.PI / 2; // Rotate 90 degrees to face upwards
    }
  });

  // ✅ Fix Dragging - Use Correct Axis & Prevent Jumping
  const bind = useDrag(({ offset: [x, y, z], last }) => {
    const snapToGrid = (value) => Math.round(value / 1) * 1;
    const newPosition = [snapToGrid(x), position[1], snapToGrid(z)]; // Keep Y unchanged

    if (!isNaN(newPosition[0]) && !isNaN(newPosition[2])) {
      setPosition(newPosition);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      {...bind()}
      castShadow
    >
      {geometry ? (
        <bufferGeometry attach="geometry" {...geometry} />
      ) : (
        <boxGeometry args={[1, 1, 1]} /> // Placeholder cube if STL fails
      )}
      <meshStandardMaterial color="lightblue" />
    </mesh>
  );
};

const Visualizer = () => {
  const [models, setModels] = useState([
    { id: 1, position: [0, 0, 0], scale: [1, 1, 1] },
  ]);

  const handleAddModel = () => {
    setModels((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        position: [prev.length * 2, 0, 0],
        scale: [1, 1, 1],
      },
    ]);
  };

  const handleScaleChange = (id, axis, value) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === id
          ? {
              ...model,
              scale: model.scale.map((s, i) =>
                i === axis ? Math.max(0.1, parseFloat(value)) : s
              ),
            }
          : model
      )
    );
  };

  return (
    <div id="visualizer-container" style={{ display: "flex" }}>
      {/* Sidebar for Controls */}
      <div style={sidebarStyle}>
        <h1>Model Controls</h1>
        <button onClick={handleAddModel} style={buttonStyle}>
          Add Model
        </button>
        {models.map((model) => (
          <div key={model.id} style={modelControlStyle}>
            <h3>Model {model.id}</h3>
            <label>
              X Scale:
              <input
                type="number"
                step="0.1"
                value={model.scale[0]}
                onChange={(e) => handleScaleChange(model.id, 0, e.target.value)}
                style={inputStyle}
              />
            </label>
            <label>
              Y Scale:
              <input
                type="number"
                step="0.1"
                value={model.scale[1]}
                onChange={(e) => handleScaleChange(model.id, 1, e.target.value)}
                style={inputStyle}
              />
            </label>
            <label>
              Z Scale:
              <input
                type="number"
                step="0.1"
                value={model.scale[2]}
                onChange={(e) => handleScaleChange(model.id, 2, e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>
        ))}
      </div>

      {/* 3D Visualizer */}
      <div style={{ flex: 1 }}>
        <Canvas shadows>
          <Suspense fallback={<LoadingSpinner />}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} castShadow />
            <OrbitControls />
            <mesh
              receiveShadow
              position={[0, -0.5, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[100, 100]} />
              <meshStandardMaterial color="#e0e0e0" />
            </mesh>
            {models.map((model) => (
              <Model
                key={model.id}
                id={model.id}
                position={model.position}
                scale={model.scale}
                setPosition={(newPosition) =>
                  setModels((prev) =>
                    prev.map((m) =>
                      m.id === model.id ? { ...m, position: newPosition } : m
                    )
                  )
                }
              />
            ))}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <mesh>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial color="gray" />
  </mesh>
);

// 🔥 UI STYLES
const sidebarStyle = {
  width: "300px",
  height: "100vh",
  overflowY: "auto",
  backgroundColor: "#2f2f2f",
  padding: "20px",
  color: "#d3d3d3",
};

const modelControlStyle = {
  marginBottom: "15px",
  padding: "10px",
  border: "1px solid #64c261",
  borderRadius: "5px",
  backgroundColor: "#3a3a3a",
};

const buttonStyle = {
  backgroundColor: "#64c261",
  padding: "10px 15px",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "5px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  margin: "5px 0",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#fff",
  color: "#000",
};

export default Visualizer;
