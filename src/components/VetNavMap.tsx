'use client';
import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { feature as topojsonFeature } from 'topojson-client';

const vertexShader = `
  uniform sampler2D heightMap;
  uniform float heightScale;
  varying float vElevation;
  void main() {
    vec4 pos = vec4(position, 1.0);
    vElevation = texture2D(heightMap, uv).r;
    pos.z += vElevation * heightScale;
    gl_Position = projectionMatrix * modelViewMatrix * pos;
  }
`;

const fragmentShader = `
  varying float vElevation;
  void main() {
    vec3 color = mix(vec3(0.0, 0.5, 0.5), vec3(0.5, 1.0, 1.0), vElevation);
    gl_FragColor = vec4(color, 0.7);
  }
`;

const State = ({ featureData, transform, heightMap, heightScale, onStateClick, isSelected }) => {
    const { scale, centerX, centerY } = transform;
    const meshRef = useRef();

    const [min, max] = useMemo(() => {
        let minPt = [Infinity, Infinity], maxPt = [-Infinity, -Infinity];
        const coords = featureData.geometry.coordinates;
        const processPolygon = (polygonCoords) => {
            polygonCoords.forEach(coord => {
                const x = (coord[0] - centerX) * scale;
                const y = -((coord[1] - centerY) * scale);
                minPt[0] = Math.min(minPt[0], x); minPt[1] = Math.min(minPt[1], y);
                maxPt[0] = Math.max(maxPt[0], x); maxPt[1] = Math.max(maxPt[1], y);
            });
        };
        if (featureData.geometry.type === 'Polygon') processPolygon(coords[0]);
        else if (featureData.geometry.type === 'MultiPolygon') coords.forEach(p => processPolygon(p[0]));
        return [minPt, maxPt];
    }, [featureData, scale, centerX, centerY]);

    const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            heightMap: { value: heightMap },
            heightScale: { value: heightScale },
        },
        vertexShader, fragmentShader, wireframe: true, transparent: true,
    }), [heightMap, heightScale]);

    const planeWidth = max[0] - min[0];
    const planeHeight = max[1] - min[1];
    
    // Check for valid dimensions before rendering
    if (!isFinite(planeWidth) || !isFinite(planeHeight) || planeWidth <= 0 || planeHeight <= 0) {
        return null;
    }

    const planeCenterX = min[0] + planeWidth / 2;
    const planeCenterY = min[1] + planeHeight / 2;

    return (
        <mesh
            ref={meshRef}
            position={[planeCenterX, planeCenterY, 0]}
            onClick={() => onStateClick(featureData.properties.name)}
        >
            <planeGeometry args={[planeWidth, planeHeight, 128, 128]} />
            <primitive object={shaderMaterial} attach="material" />
        </mesh>
    );
};

const MapScene = ({ states, transformParams, onStateClick, selectedState }) => {
    // This hook is now correctly INSIDE a child of the Canvas component
    const heightMap = useTexture('/textures/usa_heightmap.png');

    return (
        <Suspense fallback={null}>
            <color attach="background" args={['#0a0a1a']} />
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 20, 20]} intensity={1.5} color="#87CEEB" />
            <group>
                {states.map((feature) => (
                    <State
                        key={feature.id}
                        featureData={feature}
                        transform={transformParams}
                        heightMap={heightMap}
                        heightScale={2.0}
                        onStateClick={onStateClick}
                        isSelected={selectedState === feature.properties.name}
                    />
                ))}
            </group>
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Suspense>
    );
};

const VetNavMap = () => {
    const [states, setStates] = useState([]);
    const [transformParams, setTransformParams] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/data/states-albers-10m.json')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch map topology');
                return res.json();
            })
            .then(topology => {
                const geoJson = topojsonFeature(topology, topology.objects.states);
                let allCoords = [];
                geoJson.features.forEach(f => {
                    if (f.geometry?.type === 'Polygon') allCoords.push(...f.geometry.coordinates[0]);
                    if (f.geometry?.type === 'MultiPolygon') f.geometry.coordinates.forEach(p => allCoords.push(...p[0]));
                });
                let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                allCoords.forEach(c => {
                    minX = Math.min(minX, c[0]); maxX = Math.max(maxX, c[0]);
                    minY = Math.min(minY, c[1]); maxY = Math.max(maxY, c[1]);
                });
                const dataWidth = maxX - minX;
                const params = {
                    scale: dataWidth === 0 ? 1 : 10 / dataWidth,
                    centerX: minX + dataWidth / 2,
                    centerY: minY + (maxY - minY) / 2
                };
                setTransformParams(params);
                setStates(geoJson.features);
                setLoading(false);
            }).catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleStateClick = (stateName) => {
        setSelectedState(stateName);
        console.log("Selected State:", stateName);
    };

    if (loading) return <div>Loading Map...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Canvas camera={{ position: [0, -10, 8], fov: 50 }}>
            <MapScene 
                states={states}
                transformParams={transformParams}
                onStateClick={handleStateClick}
                selectedState={selectedState}
            />
        </Canvas>
    );
};

export default VetNavMap;
