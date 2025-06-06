'use client';
import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Mask, useMask } from '@react-three/drei';
import * as THREE from 'three';
import { feature as topojsonFeature } from 'topojson-client';

const vertexShader = `
  uniform sampler2D heightMap;
  uniform float heightScale;
  uniform vec2 uvOffset;
  uniform vec2 uvScale;
  varying float vElevation;

  void main() {
    vec4 pos = vec4(position, 1.0);
    // Use the plane's UV coordinates, scaled and offset for this specific state
    vec2 lookupUv = uv * uvScale + uvOffset;
    vElevation = texture2D(heightMap, lookupUv).r;
    pos.z += vElevation * heightScale;
    gl_Position = projectionMatrix * modelViewMatrix * pos;
  }
`;

const fragmentShader = `
  varying float vElevation;
  void main() {
    vec3 color = mix(vec3(0.1, 0.4, 0.5), vec3(0.8, 1.0, 1.0), vElevation * 1.5);
    float opacity = mix(0.2, 0.8, vElevation);
    gl_FragColor = vec4(color, opacity);
  }
`;

const State = ({ featureData, transform, heightMap, heightScale, onStateClick, isSelected }) => {
    const { scale, centerX, centerY } = transform;
    const stencil = useMask(1); // Get stencil props

    // Create the 2D "cookie-cutter" shape from GeoJSON data
    const shapes = useMemo(() => {
        const createdShapes = [];
        const geomType = featureData.geometry.type;
        const coords = featureData.geometry.coordinates;
        const processPolygon = (polygonCoords) => {
            const shape = new THREE.Shape();
            polygonCoords.forEach((coord, i) => {
                const x = (coord[0] - centerX) * scale;
                const y = -((coord[1] - centerY) * scale);
                if (i === 0) shape.moveTo(x, y);
                else shape.lineTo(x, y);
            });
            createdShapes.push(shape);
        };

        if (geomType === 'Polygon') {
            if (coords[0]?.length >= 4) processPolygon(coords[0]);
        } else if (geomType === 'MultiPolygon') {
            coords.forEach(polygon => {
                if (polygon[0]?.length >= 4) processPolygon(polygon[0]);
            });
        }
        return createdShapes;
    }, [featureData, scale, centerX, centerY]);

    // Calculate the bounding box and UV offsets for the terrain plane
    const [planeArgs, uvArgs] = useMemo(() => {
        const box = new THREE.Box3();
        shapes.forEach(shape => {
            const points = shape.getPoints();
            points.forEach(p => box.expandByPoint(new THREE.Vector3(p.x, p.y, 0)));
        });
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Calculate UV scale and offset to map the heightmap correctly
        const uvScale = new THREE.Vector2(size.x / transform.mapWidth, size.y / transform.mapHeight);
        const uvOffset = new THREE.Vector2(
            (box.min.x - transform.minX) / transform.mapWidth,
            (box.min.y - transform.minY) / transform.mapHeight
        );

        return [[size.x, size.y, 128, 128], { uvScale, uvOffset }];
    }, [shapes, transform]);

    const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            heightMap: { value: heightMap },
            heightScale: { value: heightScale },
            uvScale: { value: uvArgs.uvScale },
            uvOffset: { value: uvArgs.uvOffset },
        },
        vertexShader, fragmentShader, wireframe: true, transparent: true
    }), [heightMap, heightScale, uvArgs]);

    if (!planeArgs[0] || !planeArgs[1]) return null;

    return (
        <group onClick={() => onStateClick(featureData.properties.name)}>
            {/* 1. Render the invisible mask (the cookie-cutter) */}
            <mesh {...stencil}>
                <shapeGeometry args={[shapes]} />
            </mesh>

            {/* 2. Render the 3D terrain, clipped by the mask */}
            <Mask id={1}>
                <mesh material={shaderMaterial}>
                    <planeGeometry args={planeArgs} />
                </mesh>
            </Mask>
        </group>
    );
};

const MapScene = ({ states, transformParams, onStateClick, selectedState }) => {
    const heightMap = useTexture('/textures/usa_heightmap.png');
    return (
        <Suspense fallback={null}>
            <color attach="background" args={['#0a0a1a']} />
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 20, 20]} intensity={1.5} color="#87CEEB" />
            <group position={[0,0,-1]}>
                {states.map((feature) => (
                    <State
                        key={feature.id}
                        featureData={feature}
                        transform={transformParams}
                        heightMap={heightMap}
                        heightScale={selectedState === feature.properties.name ? 3.0 : 1.5}
                        onStateClick={onStateClick}
                        isSelected={selectedState === feature.properties.name}
                    />
                ))}
            </group>
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} makeDefault />
        </Suspense>
    );
};

const VetNavMap = () => {
    const [states, setStates] = useState([]);
    const [transformParams, setTransformParams] = useState(null);
    const [selectedState, setSelectedState] = useState(null);

    useEffect(() => {
        fetch('/data/states-albers-10m.json').then(res => res.json()).then(topology => {
            const geoJson = topojsonFeature(topology, topology.objects.states);
            let allCoords = [];
            geoJson.features.forEach(f => {
                if(f.geometry?.type === 'Polygon') allCoords.push(...f.geometry.coordinates[0]);
                if(f.geometry?.type === 'MultiPolygon') f.geometry.coordinates.forEach(p => allCoords.push(...p[0]));
            });
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            allCoords.forEach(c => {
                minX = Math.min(minX, c[0]); maxX = Math.max(maxX, c[0]);
                minY = Math.min(minY, c[1]); maxY = Math.max(maxY, c[1]);
            });
            const dataWidth = maxX - minX;
            const dataHeight = maxY - minY;
            const params = {
                scale: dataWidth === 0 ? 1 : 10 / dataWidth,
                centerX: minX + dataWidth / 2,
                centerY: minY + dataHeight / 2,
                mapWidth: 10, // target display width
                mapHeight: 10 * (dataHeight / dataWidth),
                minX: -10 / 2,
                minY: - (10 * (dataHeight / dataWidth)) / 2
            };
            setTransformParams(params);
            setStates(geoJson.features);
        });
    }, []);

    const handleStateClick = (stateName) => setSelectedState(stateName);

    if (!transformParams) return <div>Loading Map...</div>;

    return (
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
            <MapScene states={states} transformParams={transformParams} onStateClick={handleStateClick} selectedState={selectedState} />
        </Canvas>
    );
};

export default VetNavMap;
