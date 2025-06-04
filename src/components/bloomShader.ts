// src/components/bloomShader.ts
export const bloomVertexShader = `
#version 300 es
precision highp float;

in vec2 position;
out vec2 vTexCoord;

void main() {
  vTexCoord = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const bloomFragmentShader = `
#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform sampler2D uBloomTexture;
uniform float uThreshold;
uniform float uIntensity;
uniform vec2 uTexelSize;
uniform int uBlurDirection;

in vec2 vTexCoord;
out vec4 fragColor;

const float weights[5] = float[](0.2270270270, 0.1945945946, 0.1216216216, 0.0540540541, 0.0162162162);

vec3 extractBright(vec3 color) {
  float brightness = dot(color, vec3(0.2126, 0.7152, 0.0722));
  return max(color * (brightness - uThreshold), 0.0) * uIntensity;
}

vec3 gaussianBlur() {
  vec2 texOffset = (uBlurDirection == 0) ? vec2(uTexelSize.x, 0.0) : vec2(0.0, uTexelSize.y);
  vec3 result = texture(uTexture, vTexCoord).rgb * weights[0];
  
  for(int i = 1; i < 5; ++i) {
    result += texture(uTexture, vTexCoord + texOffset * float(i)).rgb * weights[i];
    result += texture(uTexture, vTexCoord - texOffset * float(i)).rgb * weights[i];
  }
  return result;
}

vec3 composite() {
  vec3 original = texture(uTexture, vTexCoord).rgb;
  vec3 bloom = texture(uBloomTexture, vTexCoord).rgb;
  return original + bloom * uIntensity * 0.5; // Reduce bloom intensity in composite
}

void main() {
  if (uBlurDirection == -1) {
    // Bright extraction pass
    vec3 color = texture(uTexture, vTexCoord).rgb;
    fragColor = vec4(extractBright(color), 1.0);
  } else if (uBlurDirection == 2) {
    // Composite pass
    vec3 finalColor = composite();
    fragColor = vec4(finalColor, 1.0);
  } else {
    // Blur passes (horizontal: 0, vertical: 1)
    vec3 blurredColor = gaussianBlur();
    fragColor = vec4(blurredColor, 1.0);
  }
}
`;