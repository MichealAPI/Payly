// Globe.jsx
import React, { useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping, ClampToEdgeWrapping, SRGBColorSpace, LinearMipmapLinearFilter, LinearFilter } from "three";
import { OrbitControls } from "@react-three/drei";
import earthTextureImg from "./textures/earth_map_purple_texture.png";

function Earth() {
  const meshRef = useRef();
  const { gl } = useThree();
  const earthTexture = useLoader(TextureLoader, earthTextureImg);

  // Configure texture for proper globe mapping
  useEffect(() => {
    if (!earthTexture) return;
    // Ensure correct color and sampling
    earthTexture.colorSpace = SRGBColorSpace;
    earthTexture.wrapS = RepeatWrapping;       // horizontal seam repeats
    earthTexture.wrapT = ClampToEdgeWrapping;  // prevent top/bottom bleeding
    earthTexture.minFilter = LinearMipmapLinearFilter;
    earthTexture.magFilter = LinearFilter;
    earthTexture.generateMipmaps = true;
    // Improve pole quality
    const maxAniso = typeof gl.capabilities.getMaxAnisotropy === "function"
      ? gl.capabilities.getMaxAnisotropy()
      : gl.capabilities.anisotropy || 8;
    earthTexture.anisotropy = maxAniso;
    earthTexture.needsUpdate = true;
  }, [earthTexture, gl]);

  // Rotate each frame
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.05;
  });

  return (
    <mesh ref={meshRef}>
  {/* Slightly fewer segments for performance without visible loss */}
  <sphereGeometry args={[2, 48, 48]} />
      {/* Glass-like material: slightly transparent with subtle reflections */}
      <meshPhysicalMaterial
        map={earthTexture}
        metalness={0.2}
        roughness={0.15}
        clearcoat={1}
        clearcoatRoughness={0.05}
        transparent
        opacity={0.82}
        transmission={0.5}
        thickness={0.4}
        ior={1.2}
      />
    </mesh>
  );
}

export default function Globe() {
  return (
    <Canvas
      gl={{ alpha: true, powerPreference: 'high-performance' }}
      className="globe-shadow"
      style={{ background: "transparent" }}
      camera={{ position: [0, 0, 8], fov: 45 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.7} />
        <pointLight position={[10, 10, 10]} intensity={1.8} />
        <Earth />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.3} 
        />
      </Suspense>
    </Canvas>
  );
}
