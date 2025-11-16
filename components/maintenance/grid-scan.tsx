"use client"

import { useEffect, useRef, useState } from 'react'
import './GridScan.css'

// Import heavy libs lazily to keep initial bundle smaller
import * as THREE from 'three'
// postprocessing and face-api are optional; if missing, we fallback gracefully
let EffectComposer: any
let RenderPass: any
let EffectPass: any
let BloomEffect: any
let ChromaticAberrationEffect: any
let faceapi: any

// Vertex shader
const vert = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

// Fragment shader (trimmed from user-provided)
const frag = `
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec2 uSkew;
uniform float uTilt;
uniform float uYaw;
uniform float uLineThickness;
uniform vec3 uLinesColor;
uniform vec3 uScanColor;
uniform float uGridScale;
uniform float uLineStyle;
uniform float uLineJitter;
uniform float uScanOpacity;
uniform float uScanDirection;
uniform float uNoise;
uniform float uBloomOpacity;
uniform float uScanGlow;
uniform float uScanSoftness;
uniform float uPhaseTaper;
uniform float uScanDuration;
uniform float uScanDelay;
varying vec2 vUv;
uniform float uScanStarts[8];
uniform float uScanCount;
const int MAX_SCANS = 8;
float smoother01(float a, float b, float x){
  float t = clamp((x - a) / max(1e-5, (b - a)), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
  vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  vec3 ro = vec3(0.0);
  vec3 rd = normalize(vec3(p, 2.0));
  float cR = cos(uTilt), sR = sin(uTilt);
  rd.xy = mat2(cR, -sR, sR, cR) * rd.xy;
  float cY = cos(uYaw), sY = sin(uYaw);
  rd.xz = mat2(cY, -sY, sY, cY) * rd.xz;
  vec2 skew = clamp(uSkew, vec2(-0.7), vec2(0.7));
  rd.xy += skew * rd.z;
  vec3 color = vec3(0.0);
  float minT = 1e20;
  float gridScale = max(1e-5, uGridScale);
  vec2 gridUV = vec2(0.0);
  float hitIsY = 1.0;
  for (int i = 0; i < 4; i++)
  {
    float isY = float(i < 2);
    float pos = mix(-0.2, 0.2, float(i)) * isY + mix(-0.5, 0.5, float(i - 2)) * (1.0 - isY);
    float num = pos - (isY * ro.y + (1.0 - isY) * ro.x);
    float den = isY * rd.y + (1.0 - isY) * rd.x;
    float t = num / den;
    vec3 h = ro + rd * t;
    bool use = t > 0.0 && t < minT;
    gridUV = use ? mix(h.zy, h.xz, isY) / gridScale : gridUV;
    minT = use ? t : minT;
    hitIsY = use ? isY : hitIsY;
  }
  float jitterAmt = clamp(uLineJitter, 0.0, 1.0);
  if (jitterAmt > 0.0) {
    vec2 j = vec2(
      sin(gridUV.y * 2.7 + iTime * 1.8),
      cos(gridUV.x * 2.3 - iTime * 1.6)
    ) * (0.15 * jitterAmt);
    gridUV += j;
  }
  float fx = fract(gridUV.x);
  float fy = fract(gridUV.y);
  float ax = min(fx, 1.0 - fx);
  float ay = min(fy, 1.0 - fy);
  float wx = fwidth(gridUV.x);
  float wy = fwidth(gridUV.y);
  float halfPx = max(0.0, uLineThickness) * 0.5;
  float tx = halfPx * wx;
  float ty = halfPx * wy;
  float aax = wx;
  float aay = wy;
  float lineX = 1.0 - smoothstep(tx, tx + aax, ax);
  float lineY = 1.0 - smoothstep(ty, ty + aay, ay);
  if (uLineStyle > 0.5) {
    float dashRepeat = 4.0;
    float dashDuty = 0.5;
    float vy = fract(gridUV.y * dashRepeat);
    float vx = fract(gridUV.x * dashRepeat);
    float dashMaskY = step(vy, dashDuty);
    float dashMaskX = step(vx, dashDuty);
    if (uLineStyle < 1.5) {
      lineX *= dashMaskY;
      lineY *= dashMaskX;
    } else {
      float dotRepeat = 6.0;
      float dotWidth = 0.18;
      float cy = abs(fract(gridUV.y * dotRepeat) - 0.5);
      float cx = abs(fract(gridUV.x * dotRepeat) - 0.5);
      float dotMaskY = 1.0 - smoothstep(dotWidth, dotWidth + fwidth(gridUV.y * dotRepeat), cy);
      float dotMaskX = 1.0 - smoothstep(dotWidth, dotWidth + fwidth(gridUV.x * dotRepeat), cx);
      lineX *= dotMaskY;
      lineY *= dotMaskX;
    }
  }
  float primaryMask = max(lineX, lineY);
  vec3 colorGrid = uLinesColor * primaryMask;
  float n = fract(sin(dot(gl_FragCoord.xy + vec2(iTime * 123.4), vec2(12.9898,78.233))) * 43758.5453123);
  colorGrid += (n - 0.5) * uNoise;
  colorGrid = clamp(colorGrid, 0.0, 1.0);
  fragColor = vec4(colorGrid, primaryMask);
}
void main(){
  vec4 c;
  mainImage(c, vUv * iResolution.xy);
  gl_FragColor = c;
}
`

export function GridScan(props: {
  enableWebcam?: boolean
  showPreview?: boolean
  sensitivity?: number
  lineThickness?: number
  linesColor?: string
  scanColor?: string
  scanOpacity?: number
  gridScale?: number
  lineStyle?: 'solid' | 'dashed' | 'dotted'
  lineJitter?: number
  enablePost?: boolean
  noiseIntensity?: number
  className?: string
  style?: React.CSSProperties
}) {
  const {
    enableWebcam = false,
    showPreview = false,
    sensitivity = 0.55,
    lineThickness = 1,
    linesColor = '#392e4e',
    scanColor = '#FF9FFC',
    scanOpacity = 0.4,
    gridScale = 0.1,
    lineStyle = 'solid',
    lineJitter = 0.1,
    enablePost = true,
    noiseIntensity = 0.01,
    className,
    style,
  } = props

  const containerRef = useRef<HTMLDivElement | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const composerRef = useRef<any | null>(null)
  const rafRef = useRef<number | null>(null)

  // Helpers
  const srgbColor = (hex: string) => new THREE.Color(hex).convertSRGBToLinear()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    rendererRef.current = renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NoToneMapping
    renderer.autoClear = false
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const uniforms: Record<string, any> = {
      iResolution: { value: new THREE.Vector3(container.clientWidth, container.clientHeight, renderer.getPixelRatio()) },
      iTime: { value: 0 },
      uSkew: { value: new THREE.Vector2(0, 0) },
      uTilt: { value: 0 },
      uYaw: { value: 0 },
      uLineThickness: { value: lineThickness },
      uLinesColor: { value: srgbColor(linesColor) },
      uScanColor: { value: srgbColor(scanColor) },
      uGridScale: { value: gridScale },
      uLineStyle: { value: lineStyle === 'dashed' ? 1 : lineStyle === 'dotted' ? 2 : 0 },
      uLineJitter: { value: Math.max(0, Math.min(1, lineJitter || 0)) },
      uScanOpacity: { value: scanOpacity },
      uNoise: { value: noiseIntensity },
      uBloomOpacity: { value: 0 },
      uScanGlow: { value: 0.5 },
      uScanSoftness: { value: 2.0 },
      uPhaseTaper: { value: 0.9 },
      uScanDuration: { value: 2.0 },
      uScanDelay: { value: 2.0 },
      uScanDirection: { value: 2 },
      uScanStarts: { value: new Array(8).fill(0) },
      uScanCount: { value: 0 },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    })
    materialRef.current = material

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(quad)

    const onResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      material.uniforms.iResolution.value.set(container.clientWidth, container.clientHeight, renderer.getPixelRatio())
      if (composerRef.current) composerRef.current.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', onResize)

    let last = performance.now()
    const tick = () => {
      const now = performance.now()
      const dt = Math.max(0, Math.min(0.1, (now - last) / 1000))
      last = now
      material.uniforms.iTime.value = now / 1000
      renderer.clear(true, true, true)
      renderer.render(scene, camera)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      material.dispose()
      quad.geometry.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [
    sensitivity,
    lineThickness,
    linesColor,
    scanColor,
    scanOpacity,
    gridScale,
    lineStyle,
    lineJitter,
    enablePost,
    noiseIntensity,
  ])

  return <div ref={containerRef} className={`gridscan${props.className ? ` ${props.className}` : ''}`} style={props.style} />
}

export default GridScan


