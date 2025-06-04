import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Earth texture URLs - NASA Blue Marble and related datasets
const EARTH_TEXTURES = {
  // Day texture - NASA Blue Marble 2022 (4K resolution)
  day: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/147000/147190/eo_base_2020_clean_geo.jpg',
  
  // Night lights - NASA Earth at Night
  night: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlackMarble_2016_928x464.jpg',
  
  // Bump map for elevation/mountains  
  bump: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73934/world.topo.bathy.200412.3x5400x2700.jpg',
  
  // Specular map for ocean reflectivity
  specular: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73776/world.200412.3x5400x2700.jpg',
  
  // Cloud layer
  clouds: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud.jpg'
};

const RealisticEarthShaders = {
  vertex: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  fragment: `
    uniform sampler2D uDayTexture;
    uniform sampler2D uNightTexture;
    uniform sampler2D uSpecularTexture;
    uniform sampler2D uBumpTexture;
    uniform vec3 uSunDirection;
    uniform float uTime;
    uniform float uAtmosphereIntensity;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    
    // Atmospheric scattering constants
    const float PI = 3.14159265359;
    const vec3 rayleighScattering = vec3(5.5e-6, 13.0e-6, 22.4e-6);
    const float mieScattering = 21e-6;
    const float earthRadius = 6371000.0;
    const float atmosphereRadius = 6471000.0;
    
    // Calculate atmospheric scattering
    vec3 calculateAtmosphere(vec3 rayDir, vec3 sunDir) {
      float mu = dot(rayDir, sunDir);
      
      // Rayleigh phase function
      float rayleighPhase = 3.0 / (16.0 * PI) * (1.0 + mu * mu);
      
      // Mie phase function (simplified)
      float g = 0.758;
      float miePhase = 3.0 / (8.0 * PI) * ((1.0 - g * g) * (1.0 + mu * mu)) / 
                     ((2.0 + g * g) * pow(1.0 + g * g - 2.0 * g * mu, 1.5));
      
      // Simple atmospheric color calculation
      vec3 atmosphere = rayleighScattering * rayleighPhase + 
                       vec3(mieScattering) * miePhase;
      
      return atmosphere * uAtmosphereIntensity;
    }
    
    void main() {
      vec3 normal = normalize(vNormal);
      
      // Calculate lighting
      float lightIntensity = max(dot(normal, uSunDirection), 0.0);
      
      // Sample textures
      vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
      vec3 nightColor = texture2D(uNightTexture, vUv).rgb;
      vec3 specular = texture2D(uSpecularTexture, vUv).rgb;
      
      // Day/night terminator with smooth transition
      float terminatorWidth = 0.1;
      float dayNightMix = smoothstep(-terminatorWidth, terminatorWidth, lightIntensity);
      
      // Blend day and night textures
      vec3 surfaceColor = mix(nightColor * 0.3, dayColor, dayNightMix);
      
      // Add specular highlights for oceans
      vec3 viewDirection = normalize(vWorldPosition - cameraPosition);
      vec3 reflectDirection = reflect(-uSunDirection, normal);
      float specularIntensity = pow(max(dot(viewDirection, reflectDirection), 0.0), 32.0);
      specularIntensity *= specular.r * lightIntensity;
      
      // Add atmospheric scattering
      vec3 rayDirection = normalize(vWorldPosition - cameraPosition);
      vec3 atmosphere = calculateAtmosphere(rayDirection, uSunDirection);
      
      // Fresnel effect for atmosphere on edges
      float fresnel = 1.0 - abs(dot(rayDirection, normal));
      fresnel = pow(fresnel, 2.0);
      
      vec3 finalColor = surfaceColor + 
                       specularIntensity * vec3(0.8, 0.9, 1.0) +
                       atmosphere * fresnel * 0.3;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

const CloudShaders = {
  vertex: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  fragment: `
    uniform sampler2D uCloudTexture;
    uniform vec3 uSunDirection;
    uniform float uTime;
    uniform float uCloudSpeed;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      // Animate cloud movement
      vec2 cloudUv = vUv + vec2(uTime * uCloudSpeed * 0.01, 0.0);
      
      vec4 cloudColor = texture2D(uCloudTexture, cloudUv);
      
      // Calculate lighting on clouds
      float lightIntensity = max(dot(normalize(vNormal), uSunDirection), 0.0);
      lightIntensity = mix(0.3, 1.0, lightIntensity);
      
      // Cloud shadows and lighting
      vec3 finalCloudColor = cloudColor.rgb * lightIntensity;
      
      gl_FragColor = vec4(finalCloudColor, cloudColor.a * 0.8);
    }
  `
};

function VetNavPlanet({ orbitRadius = 8, rotationSpeed = 0.001 }) {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const [textures, setTextures] = useState({});
  const [materialsReady, setMaterialsReady] = useState(false);

  // Load all Earth textures
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const loadedTextures = {};
    let loadCount = 0;
    const totalTextures = Object.keys(EARTH_TEXTURES).length;

    Object.entries(EARTH_TEXTURES).forEach(([key, url]) => {
      loader.load(
        url,
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.colorSpace = key === 'day' || key === 'night' ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
          
          loadedTextures[key] = texture;
          loadCount++;
          
          if (loadCount === totalTextures) {
            setTextures(loadedTextures);
            setMaterialsReady(true);
          }
        },
        undefined,
        (error) => {
          console.warn(`Failed to load ${key} texture:`, error);
          // Create fallback texture
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 1;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = key === 'night' ? '#000033' : (key === 'day' ? '#4477aa' : '#888888');
          ctx.fillRect(0, 0, 1, 1);
          
          const fallbackTexture = new THREE.CanvasTexture(canvas);
          loadedTextures[key] = fallbackTexture;
          loadCount++;
          
          if (loadCount === totalTextures) {
            setTextures(loadedTextures);
            setMaterialsReady(true);
          }
        }
      );
    });
  }, []);

  // Create materials when textures are ready
  const earthMaterial = materialsReady ? new THREE.ShaderMaterial({
    vertexShader: RealisticEarthShaders.vertex,
    fragmentShader: RealisticEarthShaders.fragment,
    uniforms: {
      uDayTexture: { value: textures.day },
      uNightTexture: { value: textures.night },
      uSpecularTexture: { value: textures.specular },
      uBumpTexture: { value: textures.bump },
      uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
      uTime: { value: 0 },
      uAtmosphereIntensity: { value: 15000.0 }
    }
  }) : new THREE.MeshBasicMaterial({ color: 0x4477aa });

  const cloudMaterial = materialsReady ? new THREE.ShaderMaterial({
    vertexShader: CloudShaders.vertex,
    fragmentShader: CloudShaders.fragment,
    uniforms: {
      uCloudTexture: { value: textures.clouds },
      uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
      uTime: { value: 0 },
      uCloudSpeed: { value: 1.0 }
    },
    transparent: true,
    blending: THREE.NormalBlending,
    depthWrite: false
  }) : null;

  useFrame(({ clock }) => {
    if (!earthRef.current) return;

    const elapsed = clock.getElapsedTime();
    
    // Rotate Earth
    earthRef.current.rotation.y += rotationSpeed;
    
    // Rotate clouds slightly slower for dynamic effect
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += rotationSpeed * 0.95;
    }
    
    // Update shader uniforms
    if (materialsReady) {
      const sunDirection = new THREE.Vector3(
        Math.cos(elapsed * 0.1),
        Math.sin(elapsed * 0.05) * 0.3,
        Math.sin(elapsed * 0.1)
      ).normalize();
      
      earthMaterial.uniforms.uSunDirection.value = sunDirection;
      earthMaterial.uniforms.uTime.value = elapsed;
      
      if (cloudMaterial) {
        cloudMaterial.uniforms.uSunDirection.value = sunDirection;
        cloudMaterial.uniforms.uTime.value = elapsed;
      }
    }

    // Orbital motion
    const angle = elapsed * 0.02;
    earthRef.current.position.x = Math.cos(angle) * orbitRadius;
    earthRef.current.position.z = Math.sin(angle) * orbitRadius;
  });

  return (
    <group>
      {/* Earth */}
      <mesh ref={earthRef} position={[orbitRadius, 0, 0]}>
        <sphereGeometry args={[1, 64, 32]} />
        <primitive object={earthMaterial} />
      </mesh>
      
      {/* Clouds */}
      {cloudMaterial && (
        <mesh ref={cloudsRef} position={[orbitRadius, 0, 0]}>
          <sphereGeometry args={[1.01, 64, 32]} />
          <primitive object={cloudMaterial} />
        </mesh>
      )}
    </group>
  );
}

export default VetNavPlanet; 