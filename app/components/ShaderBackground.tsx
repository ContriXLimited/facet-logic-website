"use client";

import { useEffect, useRef } from "react";

const vertSrc = `attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const fragSrc = `precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform float u_coronaSize;
uniform float u_rayIntensity;
uniform vec2 u_mouse;

#define PI 3.14159265359
#define TAU 6.28318530718

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
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

float fbm3(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 3; i++) {
    v += a * vnoise(p);
    p = rot * p * 2.1 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

float fbm4(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.866, 0.5, -0.5, 0.866);
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = rot * p * 2.05 + vec2(3.1, 7.4);
    a *= 0.48;
  }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);
  float t = u_time;
  float coronaSize = u_coronaSize;
  float rayIntensity = u_rayIntensity;

  float r = length(uv);
  float a = atan(uv.y, uv.x);

  // Deep space background - deep purple tint
  vec3 col = vec3(0.008, 0.003, 0.015);

  // Star field
  vec2 starGrid = floor(gl_FragCoord.xy / 3.0);
  float starHash = hash(starGrid * 0.73 + vec2(13.7, 29.3));
  float starBright = step(0.997, starHash);
  float twinkle = sin(t * 1.5 + starHash * 100.0) * 0.4 + 0.6;
  starBright *= twinkle * hash(starGrid * 1.31 + vec2(7.1, 3.9));
  starBright *= smoothstep(0.15, 0.45, r);
  col += vec3(0.7, 0.6, 0.95) * starBright * 0.6;

  // Eclipse disc
  float discRadius = 0.15;
  float chromoRadius = discRadius + 0.008;

  float rotAngle = a + t * 0.05;

  // Corona rays
  float ray1 = fbm3(vec2(rotAngle * 3.0, r * 4.0 - t * 0.08));
  float ray2 = fbm3(vec2(rotAngle * 7.0 + 5.0, r * 6.0 - t * 0.12));
  float ray3 = fbm4(vec2(rotAngle * 13.0 + 10.0, r * 8.0 - t * 0.18));
  float rays = ray1 * 0.5 + ray2 * 0.3 + ray3 * 0.2;

  // Angular asymmetry
  float asymmetry = 0.7 + 0.3 * sin(a * 2.0 + 0.5) * sin(a * 3.0 + t * 0.02);
  asymmetry += 0.15 * sin(a * 5.0 + 1.7);
  rays *= asymmetry;

  // Radial falloff
  float coronaOuter = discRadius + 0.35 * coronaSize;
  float radialFalloff = smoothstep(coronaOuter, discRadius + 0.02, r);
  radialFalloff *= smoothstep(discRadius - 0.01, discRadius + 0.03, r);

  float rayReach = discRadius + 0.6 * coronaSize;
  float rayFalloff = smoothstep(rayReach, discRadius + 0.03, r);
  rayFalloff *= smoothstep(discRadius - 0.01, discRadius + 0.03, r);

  // Purple corona colors
  float colorMix = smoothstep(discRadius, coronaOuter, r);
  vec3 innerColor = vec3(0.75, 0.45, 1.0);
  vec3 outerColor = vec3(0.45, 0.12, 0.82);
  vec3 coronaColor = mix(innerColor, outerColor, colorMix);

  // Corona glow
  float coronaGlow = radialFalloff * (0.4 + rays * 0.6);
  col += coronaColor * coronaGlow * 1.2 * rayIntensity;

  // Extended ray streaks
  float rayStreak = rayFalloff * pow(rays, 1.5) * 0.8;
  col += mix(coronaColor, outerColor, 0.5) * rayStreak * rayIntensity;

  // Chromosphere ring
  float chromoDist = abs(r - chromoRadius);
  float chromo = exp(-chromoDist * chromoDist / 0.00008);
  float chromoNoise = fbm3(vec2(rotAngle * 10.0, t * 0.2));
  chromo *= 0.7 + chromoNoise * 0.5;
  vec3 chromoColor = vec3(0.85, 0.6, 1.0);
  col += chromoColor * chromo * 2.5 * rayIntensity;

  // Hot inner edge
  float innerEdge = exp(-pow((r - discRadius) * 80.0, 2.0));
  innerEdge *= smoothstep(discRadius - 0.02, discRadius + 0.005, r);
  col += vec3(0.9, 0.75, 1.0) * innerEdge * 3.0;

  // Solar wind streaks
  float windA = floor((a + t * 0.02) * 80.0);
  float windR2 = floor((r - t * 0.06) * 100.0);
  float wind = hash(vec2(windA, windR2));
  wind = smoothstep(0.95, 1.0, wind);
  float windFade = smoothstep(discRadius, discRadius + 0.05, r);
  windFade *= smoothstep(rayReach + 0.08, discRadius + 0.06, r);
  col += vec3(0.7, 0.5, 1.0) * wind * windFade * 0.06 * rayIntensity;

  // Bloom
  float bloomDist = max(r - discRadius, 0.0);
  float bloom = exp(-bloomDist * 2.5);
  bloom *= smoothstep(discRadius - 0.05, discRadius + 0.01, r);
  col += vec3(0.25, 0.1, 0.4) * bloom * 0.25 * rayIntensity;

  float wideBloom = exp(-r * 1.2) * 0.15;
  col += vec3(0.18, 0.06, 0.3) * wideBloom * rayIntensity;

  // Horizontal lens streak
  float streak = exp(-uv.y * uv.y * 80.0) * exp(-abs(r - discRadius) * 5.0);
  streak *= smoothstep(discRadius - 0.02, discRadius + 0.05, r);
  col += vec3(0.4, 0.2, 0.6) * streak * 0.08 * rayIntensity;

  // Dark moon disc
  float disc = smoothstep(discRadius + 0.003, discRadius - 0.003, r);
  col *= 1.0 - disc;
  float lunarNoise = vnoise(uv * 40.0) * 0.008;
  col += vec3(lunarNoise * 0.3, lunarNoise * 0.2, lunarNoise * 0.5) * disc;

  // Diamond ring effect
  float diamondAngle = sin(t * 0.02) * PI;
  if (u_mouse.x > 0.0) {
    vec2 mUV = (u_mouse - u_res * 0.5) / min(u_res.x, u_res.y);
    diamondAngle = atan(mUV.y, mUV.x);
  }
  vec2 diamondDir = vec2(cos(diamondAngle), sin(diamondAngle));
  float diamondDot = dot(normalize(uv), diamondDir);
  float diamond = smoothstep(0.96, 1.0, diamondDot);
  float diamondR = smoothstep(discRadius + 0.025, discRadius, r);
  diamondR *= smoothstep(discRadius - 0.015, discRadius, r);
  float diamondGlow = diamond * diamondR;
  float diamondBoost = u_mouse.x > 0.0 ? 2.5 : 1.5;
  col += vec3(0.9, 0.75, 1.0) * diamondGlow * diamondBoost * rayIntensity;

  float dBloomR = exp(-pow((r - discRadius) * 20.0, 2.0));
  float dBloomA = smoothstep(0.92, 1.0, diamondDot);
  col += vec3(0.35, 0.15, 0.5) * dBloomR * dBloomA * (diamondBoost * 0.4) * rayIntensity;

  // Mouse corona pull
  if (u_mouse.x > 0.0) {
    float angleToCursor = dot(normalize(uv), diamondDir);
    float coronaPull = smoothstep(0.3, 1.0, angleToCursor);
    coronaPull *= smoothstep(discRadius, discRadius + 0.25, r);
    coronaPull *= smoothstep(0.6, discRadius + 0.05, r);
    col += vec3(0.5, 0.25, 0.8) * coronaPull * 0.15 * rayIntensity;
  }

  // Film grain
  float grain = (hash(gl_FragCoord.xy + fract(t * 43.0) * 1000.0) - 0.5) * 0.015;
  col += grain;

  // Vignette
  float vig = 1.0 - smoothstep(0.3, 1.1, r);
  col *= 0.7 + 0.3 * vig;

  // Tone mapping
  col = max(col, vec3(0.0));
  col = col / (1.0 + col * 0.3);
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, col * vec3(0.95, 0.85, 1.06), smoothstep(0.05, 0.0, lum) * 0.2);

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
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl!.getShaderInfoLog(s));
      }
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
    }
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
    const uCoronaSize = gl.getUniformLocation(prog, "u_coronaSize");
    const uRayIntensity = gl.getUniformLocation(prog, "u_rayIntensity");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    let mouseX = -1;
    let mouseY = -1;
    let running = true;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX * dpr;
      mouseY = (canvas.clientHeight - e.clientY) * dpr;
    };
    const onLeave = () => {
      mouseX = -1;
      mouseY = -1;
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    function resize() {
      const w = Math.round(canvas!.clientWidth * dpr);
      const h = Math.round(canvas!.clientHeight * dpr);
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
      gl!.uniform1f(uTime, prefersReduced ? 0.0 : now * 0.001);
      gl!.uniform1f(uCoronaSize, 1.0);
      gl!.uniform1f(uRayIntensity, 1.0);
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
      className="fixed inset-0 w-full h-full z-0"
      style={{ pointerEvents: "auto" }}
    />
  );
}
