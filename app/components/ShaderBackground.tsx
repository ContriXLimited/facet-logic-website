"use client";

import { useEffect, useRef } from "react";

const vertSrc = `attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const fragSrc = `precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform float u_heat;
uniform float u_turbulence;
uniform vec2 u_center;
uniform float u_scale;
uniform vec2 u_mouse;

#define PI 3.14159265359
#define TAU 6.28318530718

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash2(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

vec3 noised(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  float val = a + (b - a) * u.x + (c - a) * u.y + (a - b - c + d) * u.x * u.y;
  vec2 deriv = du * (vec2(b - a + (a - b - c + d) * u.y, c - a + (a - b - c + d) * u.x));
  return vec3(val, deriv);
}

float fbm(vec2 p, int octaves) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    v += a * vnoise(p);
    p = rot * p * 2.05 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 fbmd(vec2 p, int octaves) {
  float v = 0.0, a = 0.5;
  vec2 d = vec2(0.0);
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    vec3 n = noised(p);
    v += a * n.x;
    d += a * n.yz;
    p = rot * p * 2.05 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return vec3(v, d);
}

float ridged(vec2 p, int octaves) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    float n = vnoise(p);
    n = 1.0 - abs(n * 2.0 - 1.0);
    n = n * n;
    v += a * n;
    p = rot * p * 2.1 + vec2(3.2, 1.3);
    a *= 0.5;
  }
  return v;
}

// Purple color mapping
vec3 tempColor(float temp, float luminosityVar) {
  vec3 c0 = vec3(0.02, 0.01, 0.04);
  vec3 c1 = vec3(0.05, 0.02, 0.10);
  vec3 c2 = vec3(0.12, 0.04, 0.22);
  vec3 c3 = vec3(0.30, 0.08, 0.55);
  vec3 c4 = vec3(0.47, 0.12, 0.82);
  vec3 c5 = vec3(0.65, 0.30, 1.2);
  vec3 c6 = vec3(0.85, 0.55, 1.6);
  vec3 c7 = vec3(1.5, 1.2, 2.5);

  vec3 col;
  if (temp < 0.12) {
    col = mix(c0, c1, temp / 0.12);
  } else if (temp < 0.25) {
    col = mix(c1, c2, (temp - 0.12) / 0.13);
  } else if (temp < 0.38) {
    col = mix(c2, c3, (temp - 0.25) / 0.13);
  } else if (temp < 0.52) {
    col = mix(c3, c4, (temp - 0.38) / 0.14);
  } else if (temp < 0.68) {
    col = mix(c4, c5, (temp - 0.52) / 0.16);
  } else if (temp < 0.85) {
    col = mix(c5, c6, (temp - 0.68) / 0.17);
  } else {
    col = mix(c6, c7, (temp - 0.85) / 0.15);
  }

  col *= 1.0 + luminosityVar * 0.25;
  return col;
}

void main() {
  vec2 origin = u_scale > 0.0 ? u_center : vec2(0.5);
  float sc = u_scale > 0.0 ? u_scale : 1.0;
  vec2 uv = (gl_FragCoord.xy - u_res * origin) / (min(u_res.x, u_res.y) * sc);
  float t = u_time;
  float heat = u_heat;
  float turb = u_turbulence;

  float dist = length(uv);

  float mouseHeat = 0.0;
  if (u_mouse.x > 0.0) {
    vec2 mUV = (u_mouse - u_res * origin) / (min(u_res.x, u_res.y) * sc);
    float mDist = length(uv - mUV);
    mouseHeat = exp(-mDist * mDist * 4.0);
  }

  float angle = atan(uv.y, uv.x);
  float ca = cos(angle);
  float sa = sin(angle);

  float turb1 = fbm(vec2(ca * 1.5 + sa * 0.7 + t * 0.08, dist * 2.0 - t * 0.05) * 1.8, 5) * turb;
  float turb2 = fbm(vec2(ca * 3.0 - sa * 1.5 - t * 0.12, dist * 3.5 + t * 0.07) * 2.5 + vec2(50.0, 30.0), 4) * turb;
  float turb3 = fbm(vec2(ca * 5.0 + sa * 2.5 + t * 0.2, dist * 5.0 - t * 0.15) * 3.0 + vec2(100.0, 70.0), 3) * turb;

  float turbTotal = turb1 * 0.45 + turb2 * 0.35 + turb3 * 0.2;

  float deformStrength = smoothstep(0.0, 0.3, dist) * smoothstep(0.9, 0.4, dist);
  float deformedDist = dist + (turbTotal - 0.5) * 0.35 * deformStrength;

  float pulse = sin(t * 0.15) * 0.04 + sin(t * 0.23 + 1.7) * 0.03 + sin(t * 0.37 + 3.1) * 0.02;
  deformedDist -= pulse * heat;

  float tempRange = 0.65 / heat;
  float temp = 1.0 - smoothstep(0.0, tempRange, deformedDist);
  float coreBoost = (1.0 - smoothstep(0.0, 0.15 / heat, deformedDist));
  temp = temp * 0.7 + coreBoost * 0.3;
  temp += mouseHeat * 0.6;
  temp = clamp(temp, 0.0, 1.0);

  float lumVar = fbm(uv * 4.0 + t * 0.06, 3) * 2.0 - 1.0;
  vec3 col = tempColor(temp, lumVar);

  vec3 shimmerNoise = fbmd(uv * 8.0 + vec2(t * 0.3, t * 0.25), 4);
  float shimmerWave = shimmerNoise.x;
  vec2 shimmerDir = shimmerNoise.yz;

  float shimmerStrength = temp * temp * turb;
  float shimmerRipple = dot(shimmerDir, vec2(0.7, 0.7));
  shimmerRipple = shimmerRipple * shimmerRipple * shimmerStrength;
  col += col * shimmerRipple * 0.4;

  float shimmerHighlight = pow(max(shimmerWave, 0.0), 4.0) * temp * temp;
  col += vec3(0.6, 0.3, 1.0) * shimmerHighlight * 0.2 * heat;

  float veins1 = ridged(uv * 5.0 + vec2(t * 0.06, -t * 0.04), 4);
  float veins2 = ridged(uv * 8.0 + vec2(-t * 0.08, t * 0.05) + vec2(20.0, 40.0), 3);
  float veins3 = ridged(uv * 13.0 + vec2(t * 0.1, t * 0.07) + vec2(60.0, 90.0), 2);

  float veins = veins1 * 0.5 + veins2 * 0.35 + veins3 * 0.15;
  veins = smoothstep(0.3, 0.75, veins);
  veins = pow(veins, 2.0);

  float veinMask = smoothstep(0.15, 0.5, temp) * smoothstep(1.0, 0.7, temp);
  float veinIntensity = veins * veinMask * 0.7 * heat;

  vec3 veinColor = vec3(0.6, 0.3, 1.0);
  veinColor = mix(veinColor, vec3(0.45, 0.15, 0.9), veins2);
  col += veinColor * veinIntensity;

  float emberScale = 18.0;
  vec2 emberUV = uv * emberScale;
  emberUV.y -= t * 0.4;
  emberUV.x += sin(t * 0.3 + uv.y * 4.0) * 0.15;

  vec2 emberId = floor(emberUV);
  vec2 emberF = fract(emberUV) - 0.5;

  float embers = 0.0;
  for (int ey = -1; ey <= 1; ey++) {
    for (int ex = -1; ex <= 1; ex++) {
      vec2 neighbor = vec2(float(ex), float(ey));
      vec2 cellId = emberId + neighbor;
      vec2 rnd = hash2(cellId);
      if (rnd.x > 0.08) continue;
      vec2 emberPos = neighbor + rnd - 0.5;
      float emberDist = length(emberF - emberPos);
      float phase = hash(cellId + vec2(77.0, 33.0));
      float life = fract(phase + t * 0.08);
      float brightness = sin(life * PI) * sin(life * PI);
      brightness *= 0.5 + 0.5 * sin(t * 5.0 + phase * TAU);
      float glow = smoothstep(0.08, 0.0, emberDist);
      float core = smoothstep(0.025, 0.0, emberDist) * 2.0;
      embers += (glow + core) * brightness;
    }
  }

  float emberTemp = temp;
  float emberMask = smoothstep(0.2, 0.5, emberTemp);
  embers *= emberMask;
  vec3 emberColor = vec3(0.7, 0.4, 1.0);
  col += emberColor * embers * 0.12 * heat;

  float grainSeed = hash(gl_FragCoord.xy + fract(t * 43.758) * 1000.0);
  float grain = (grainSeed - 0.5);
  float transitionMask = smoothstep(0.1, 0.35, temp) * smoothstep(0.7, 0.35, temp);
  float grainStrength = 0.012 + transitionMask * 0.018;
  vec3 grainColor = vec3(grain * 0.8, grain * 0.5, grain * 1.1);
  col += grainColor * grainStrength;

  float vig = length(uv * 1.1);
  float vignette = 1.0 - smoothstep(0.5, 1.3, vig) * 0.3;
  col *= vignette;

  col = col * (2.51 * col + 0.03) / (col * (2.43 * col + 0.59) + 0.14);
  col = max(col, vec3(0.0));

  gl_FragColor = vec4(col, 1.0);
}`;

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uHeat = gl.getUniformLocation(prog, "u_heat");
    const uTurbulence = gl.getUniformLocation(prog, "u_turbulence");
    const uCenter = gl.getUniformLocation(prog, "u_center");
    const uScale = gl.getUniformLocation(prog, "u_scale");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    let mouseX = -1;
    let mouseY = -1;
    let running = true;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = canvas.clientHeight - e.clientY;
    };
    const onLeave = () => {
      mouseX = -1;
      mouseY = -1;
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(canvas!.clientWidth * dpr * 0.5);
      const h = Math.round(canvas!.clientHeight * dpr * 0.5);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
        gl!.uniform2f(uRes, w, h);
      }
    }

    resize();
    window.addEventListener("resize", resize);

    let animId: number;
    function render(now: number) {
      if (!running) {
        animId = requestAnimationFrame(render);
        return;
      }
      gl!.uniform1f(uTime, prefersReduced ? 0.0 : now * 0.002);
      gl!.uniform1f(uHeat, 0.8);
      gl!.uniform1f(uTurbulence, 1.8);
      gl!.uniform2f(uCenter, 0.0, 0.0);
      gl!.uniform1f(uScale, 0.0);
      gl!.uniform2f(uMouse, mouseX, mouseY);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      animId = requestAnimationFrame(render);
    }

    const onVisibility = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ pointerEvents: "auto" }}
    />
  );
}
