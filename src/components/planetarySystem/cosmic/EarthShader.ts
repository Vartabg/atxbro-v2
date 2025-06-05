// Advanced Earth shader with day/night cycle and atmosphere
import * as THREE from 'three';

export interface EarthShaderUniforms {
  // Texture uniforms
  uDayTexture: { value: THREE.Texture | null };
  uNightTexture: { value: THREE.Texture | null };
  uCloudTexture: { value: THREE.Texture | null };
  uNormalTexture: { value: THREE.Texture | null };
  uSpecularTexture: { value: THREE.Texture | null };
  
  // Lighting uniforms
  uSunDirection: { value: THREE.Vector3 };
  uSunIntensity: { value: number };
  uAmbientIntensity: { value: number };
  
  // Atmospheric uniforms
  uAtmosphereThickness: { value: number };
  uRayleighCoeff: { value: THREE.Vector3 };
  uMieCoeff: { value: number };
  uMieDirectionalG: { value: number };
  uAtmosphereScale: { value: number };
  
  // Ocean uniforms
  uOceanSpecular: { value: number };
  uOceanRoughness: { value: number };
  uFresnelPower: { value: number };
  
  // Cloud uniforms
  uCloudOpacity: { value: number };
  uCloudSpeed: { value: number };
  uCloudScale: { value: number };
  
  // Animation uniforms
  uTime: { value: number };
  uRotationSpeed: { value: number };
}

export const createEarthShaderMaterial = (uniforms: EarthShaderUniforms): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    transparent: true,
    side: THREE.FrontSide,
    depthWrite: true,
    depthTest: true,
  });
};

const earthVertexShader = `
precision highp float;

uniform vec3 uSunDirection;
uniform float uTime;
uniform float uRotationSpeed;
uniform float uAtmosphereScale;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying vec3 vSunDirection;
varying float vSunDot;
varying float vViewDot;
varying vec3 vViewDirection;

void main() {
  // Basic vertex transformation
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  vPosition = position;
  
  // Calculate view direction
  vViewDirection = normalize(cameraPosition - worldPosition.xyz);
  
  // Transform normal to world space
  vNormal = normalize(normalMatrix * normal);
  
  // Calculate sun direction in world space
  vSunDirection = normalize(uSunDirection);
  
  // Calculate dot products for lighting
  vSunDot = dot(vNormal, vSunDirection);
  vViewDot = dot(vNormal, vViewDirection);
  
  // Animate UV coordinates for rotation
  vUv = uv;
  vUv.x += uTime * uRotationSpeed;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const earthFragmentShader = `
precision highp float;

// Texture uniforms
uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uCloudTexture;
uniform sampler2D uNormalTexture;
uniform sampler2D uSpecularTexture;

// Lighting uniforms
uniform vec3 uSunDirection;
uniform float uSunIntensity;
uniform float uAmbientIntensity;

// Atmospheric uniforms
uniform float uAtmosphereThickness;
uniform vec3 uRayleighCoeff;
uniform float uMieCoeff;
uniform float uMieDirectionalG;
uniform float uAtmosphereScale;

// Ocean uniforms
uniform float uOceanSpecular;
uniform float uOceanRoughness;
uniform float uFresnelPower;

// Cloud uniforms
uniform float uCloudOpacity;
uniform float uCloudSpeed;
uniform float uCloudScale;

// Animation uniforms
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
varying vec3 vSunDirection;
varying float vSunDot;
varying float vViewDot;
varying vec3 vViewDirection;

// Atmospheric scattering functions
float rayleighPhase(float cosTheta) {
  return (3.0 / (16.0 * 3.14159)) * (1.0 + cosTheta * cosTheta);
}

float miePhase(float cosTheta, float g) {
  float g2 = g * g;
  float num = (1.0 - g2) * (1.0 + cosTheta * cosTheta);
  float denom = (2.0 + g2) * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5);
  return (3.0 / (8.0 * 3.14159)) * num / denom;
}

vec3 calculateAtmosphericScattering(vec3 rayDirection, vec3 sunDirection, float rayLength) {
  float cosTheta = dot(rayDirection, sunDirection);
  
  // Simplified atmospheric scattering
  float rayleighFactor = rayleighPhase(cosTheta);
  float mieFactor = miePhase(cosTheta, uMieDirectionalG);
  
  // Calculate optical depth (simplified)
  float opticalDepth = rayLength * uAtmosphereThickness;
  float rayleighExtinction = exp(-opticalDepth * length(uRayleighCoeff));
  float mieExtinction = exp(-opticalDepth * uMieCoeff);
  
  // Scattering colors
  vec3 rayleighScatter = uRayleighCoeff * rayleighFactor * rayleighExtinction;
  vec3 mieScatter = vec3(uMieCoeff) * mieFactor * mieExtinction;
  
  return (rayleighScatter + mieScatter) * uSunIntensity;
}

vec3 calculateFresnel(vec3 viewDir, vec3 normal, vec3 baseReflectivity) {
  float cosTheta = max(dot(viewDir, normal), 0.0);
  return baseReflectivity + (1.0 - baseReflectivity) * pow(1.0 - cosTheta, uFresnelPower);
}

void main() {
  // Sample textures
  vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
  vec3 nightColor = texture2D(uNightTexture, vUv).rgb;
  
  // Animated cloud UV
  vec2 cloudUv = vUv;
  cloudUv.x += uTime * uCloudSpeed;
  vec4 cloudSample = texture2D(uCloudTexture, cloudUv);
  
  vec3 normalSample = texture2D(uNormalTexture, vUv).rgb;
  float specularSample = texture2D(uSpecularTexture, vUv).r;
  
  // Decode normal map
  vec3 normalMap = normalize(normalSample * 2.0 - 1.0);
  vec3 normal = normalize(vNormal + normalMap * 0.1);
  
  // Calculate lighting
  float sunDot = dot(normal, vSunDirection);
  float dayFactor = smoothstep(-0.1, 0.1, sunDot);
  float nightFactor = 1.0 - dayFactor;
  
  // Base surface color
  vec3 surfaceColor = mix(nightColor * 0.8, dayColor, dayFactor);
  
  // Add ambient lighting
  surfaceColor += dayColor * uAmbientIntensity;
  
  // Ocean specular reflection
  if (specularSample > 0.5) {
    vec3 reflectDir = reflect(-vViewDirection, normal);
    float specularDot = max(dot(reflectDir, vSunDirection), 0.0);
    float specularIntensity = pow(specularDot, 32.0 / uOceanRoughness);
    
    // Fresnel effect for ocean
    vec3 fresnel = calculateFresnel(vViewDirection, normal, vec3(0.02));
    vec3 oceanSpecular = fresnel * specularIntensity * uOceanSpecular;
    
    surfaceColor += oceanSpecular;
  }
  
  // City lights enhancement on night side
  vec3 cityLights = nightColor * 2.0 * nightFactor;
  surfaceColor += cityLights * (1.0 - dayFactor);
  
  // Cloud layer
  vec3 cloudColor = vec3(1.0);
  float cloudShadow = 1.0 - cloudSample.a * 0.3;
  surfaceColor *= cloudShadow;
  
  // Add cloud contribution
  vec3 cloudLit = cloudColor * max(sunDot, 0.2);
  surfaceColor = mix(surfaceColor, cloudLit, cloudSample.a * uCloudOpacity);
  
  // Atmospheric scattering at limb
  float atmosphereFactor = 1.0 - abs(vViewDot);
  atmosphereFactor = pow(atmosphereFactor, 2.0);
  
  vec3 atmosphereColor = calculateAtmosphericScattering(
    vViewDirection, 
    vSunDirection, 
    atmosphereFactor * uAtmosphereScale
  );
  
  // Combine surface and atmosphere
  surfaceColor = mix(surfaceColor, atmosphereColor, atmosphereFactor * 0.3);
  
  // Add atmospheric rim lighting
  float rimIntensity = pow(1.0 - abs(vViewDot), 3.0);
  vec3 rimColor = vec3(0.3, 0.6, 1.0) * rimIntensity * 0.5;
  surfaceColor += rimColor;
  
  // Tone mapping and gamma correction
  surfaceColor = surfaceColor / (surfaceColor + vec3(1.0));
  surfaceColor = pow(surfaceColor, vec3(1.0 / 2.2));
  
  gl_FragColor = vec4(surfaceColor, 1.0);
}
`;

// Default uniform values
export const createDefaultEarthUniforms = (): EarthShaderUniforms => ({
  // Textures (will be set by Earth class)
  uDayTexture: { value: null },
  uNightTexture: { value: null },
  uCloudTexture: { value: null },
  uNormalTexture: { value: null },
  uSpecularTexture: { value: null },
  
  // Lighting
  uSunDirection: { value: new THREE.Vector3(1, 0, 0) },
  uSunIntensity: { value: 2.0 },
  uAmbientIntensity: { value: 0.1 },
  
  // Atmospheric scattering
  uAtmosphereThickness: { value: 1.0 },
  uRayleighCoeff: { value: new THREE.Vector3(0.00519, 0.01213, 0.02962) }, // Blue sky
  uMieCoeff: { value: 0.004 },
  uMieDirectionalG: { value: 0.8 },
  uAtmosphereScale: { value: 1.2 },
  
  // Ocean properties
  uOceanSpecular: { value: 1.0 },
  uOceanRoughness: { value: 0.1 },
  uFresnelPower: { value: 5.0 },
  
  // Cloud properties
  uCloudOpacity: { value: 0.8 },
  uCloudSpeed: { value: 0.0001 },
  uCloudScale: { value: 1.0 },
  
  // Animation
  uTime: { value: 0 },
  uRotationSpeed: { value: 0.0001 }
});

export default { createEarthShaderMaterial, createDefaultEarthUniforms }; 