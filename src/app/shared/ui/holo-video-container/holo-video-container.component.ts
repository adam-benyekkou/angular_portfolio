import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  signal,
  effect,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-holo-video-container',
  imports: [CommonModule],
  templateUrl: './holo-video-container.component.html',
  styleUrl: './holo-video-container.component.css',
})
export class HoloVideoContainerComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() videoSrc?: string;
  @Input() containerClasses: string = 'w-full h-96'; // Default with height

  isLoading = signal(false);

  // Three.js objects
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private points!: THREE.Points;
  private geometry!: THREE.BufferGeometry;
  private material!: THREE.PointsMaterial;
  private glowLayers: Array<{
    points: THREE.Points;
    geometry: THREE.BufferGeometry;
  }> = [];

  // Side decorations
  private sideElements: THREE.Group[] = [];

  private animationId: number = 0;
  private video!: HTMLVideoElement;
  private canvas2D!: HTMLCanvasElement;
  private ctx2D!: CanvasRenderingContext2D;

  readonly GRID_WIDTH = 320; // Increased from 240 for wider coverage
  readonly GRID_HEIGHT = 180;
  readonly POINTS_COUNT = this.GRID_WIDTH * this.GRID_HEIGHT;

  // Mouse and effects
  private mouseX = 0;
  private mouseY = 0;
  private isMouseOverCanvas = false;
  private glitchTime = 0;
  private glitchIntensity = 0;
  private resizeObserver!: ResizeObserver;

  constructor() {
    effect(() => {
      if (this.material) {
        this.material.size = 8.0; // Increased from 5.0 to 8.0
      }
    });
  }

  ngOnInit(): void {
    this.initThreeJS();
    this.createPointCloud();
    this.createSideDecorations();
    this.setupVideo();
    this.setupEventListeners();
    this.setupResizeObserver();
    this.animate();
    this.onWindowResize(); // Initial resize

    if (this.videoSrc) {
      this.loadVideoFromSrc(this.videoSrc);
    }
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.renderer?.dispose();
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0d14);

    // Initialize camera with even wider FOV for closer view
    this.camera = new THREE.PerspectiveCamera(40, 1, 1, 10000);
    this.camera.position.set(0, 0, 800);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  private setupResizeObserver(): void {
    const canvas = this.canvasRef.nativeElement;

    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          this.handleResize(width, height);
        }
      }
    });

    // Observe the canvas element
    this.resizeObserver.observe(canvas);
  }

  private handleResize(width: number, height: number): void {
    // Update camera aspect ratio
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Update renderer size
    this.renderer.setSize(width, height, false);

    // Calculate optimal camera distance
    const fov = this.camera.fov * (Math.PI / 180);
    const gridHeight = this.GRID_HEIGHT * 12; // Updated to match new scale
    const gridWidth = this.GRID_WIDTH * 12; // Updated to match new scale

    // Calculate visible dimensions at camera distance
    const vFov = fov;
    const hFov = 2 * Math.atan(Math.tan(fov / 2) * this.camera.aspect);

    // Calculate distance to fit width or height
    const distanceHeight = gridHeight / 2 / Math.tan(vFov / 2);
    const distanceWidth = gridWidth / 2 / Math.tan(hFov / 2);

    // Use the distance that fits both dimensions with minimal margin
    this.camera.position.z = Math.max(distanceHeight, distanceWidth) * 0.95;

    // Update side decorations position based on aspect ratio
    if (this.sideElements.length >= 2) {
      const sideOffset = this.camera.aspect * 1000;
      this.sideElements[0].position.x = -sideOffset;
      this.sideElements[1].position.x = sideOffset;
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    if (rect.width > 0 && rect.height > 0) {
      this.handleResize(rect.width, rect.height);
    }
  }

  private createPointCloud(): void {
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.POINTS_COUNT * 3);
    const colors = new Float32Array(this.POINTS_COUNT * 3);
    const originalPositions = new Float32Array(this.POINTS_COUNT * 3);

    let index = 0;
    for (let y = 0; y < this.GRID_HEIGHT; y++) {
      for (let x = 0; x < this.GRID_WIDTH; x++) {
        const posX = (x - this.GRID_WIDTH / 2) * 12; // Reduced from 16 to compensate for wider grid
        const posY = -(y - this.GRID_HEIGHT / 2) * 12; // Reduced from 16 to maintain proportion

        positions[index * 3] = posX;
        positions[index * 3 + 1] = posY;
        positions[index * 3 + 2] = 0;

        originalPositions[index * 3] = posX;
        originalPositions[index * 3 + 1] = posY;
        originalPositions[index * 3 + 2] = 0;

        colors[index * 3] = colors[index * 3 + 1] = colors[index * 3 + 2] = 1;
        index++;
      }
    }

    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.geometry.setAttribute(
      'originalPosition',
      new THREE.BufferAttribute(originalPositions, 3),
    );

    this.material = new THREE.PointsMaterial({
      size: 8.0, // Increased from 5.0 to 8.0
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      alphaTest: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
    this.createGlowLayers();
  }

  private createGlowLayers(): void {
    for (let layer = 1; layer <= 3; layer++) {
      const glowGeometry = this.geometry.clone();
      const glowMaterial = new THREE.PointsMaterial({
        size: 8.0 * (1 + layer * 0.5), // Increased base size from 5.0 to 8.0
        vertexColors: true,
        transparent: true,
        opacity: 0.3 / layer,
        alphaTest: 0.1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      const glowPoints = new THREE.Points(glowGeometry, glowMaterial);
      this.scene.add(glowPoints);
      this.glowLayers.push({ points: glowPoints, geometry: glowGeometry });
    }
  }

  private createSideDecorations(): void {
    // Create vertical scan lines on both sides
    const createScanLines = (xPosition: number) => {
      const group = new THREE.Group();

      // Main vertical lines
      for (let i = 0; i < 5; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array([
          xPosition + (i - 2) * 30,
          -1000,
          0,
          xPosition + (i - 2) * 30,
          1000,
          0,
        ]);
        geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(positions, 3),
        );

        const material = new THREE.LineBasicMaterial({
          color: new THREE.Color(0.3, 0.6, 0.8),
          transparent: true,
          opacity: 0.3,
          linewidth: 1,
        });

        const line = new THREE.Line(geometry, material);
        group.add(line);
      }

      // Floating particles
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 50;
      const positions = new Float32Array(particleCount * 3);
      const opacities = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = xPosition + (Math.random() - 0.5) * 150;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1500;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        opacities[i] = Math.random();
      }

      particleGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3),
      );
      particleGeometry.setAttribute(
        'opacity',
        new THREE.BufferAttribute(opacities, 1),
      );

      const particleMaterial = new THREE.PointsMaterial({
        size: 3,
        color: new THREE.Color(0.5, 0.8, 1.0),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        vertexColors: false,
        sizeAttenuation: true,
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      group.add(particles);

      // Add grid pattern
      const gridGroup = new THREE.Group();
      const gridSize = 100;
      const gridDivisions = 10;

      for (let j = -5; j <= 5; j++) {
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array([
          xPosition - gridSize,
          (j * gridSize) / 5,
          -50,
          xPosition + gridSize,
          (j * gridSize) / 5,
          -50,
        ]);
        lineGeometry.setAttribute(
          'position',
          new THREE.BufferAttribute(linePositions, 3),
        );

        const lineMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color(0.2, 0.4, 0.6),
          transparent: true,
          opacity: 0.2,
        });

        const gridLine = new THREE.Line(lineGeometry, lineMaterial);
        gridGroup.add(gridLine);
      }

      group.add(gridGroup);
      return group;
    };

    // Create decorations for left and right sides
    const leftDecoration = createScanLines(-2000);
    const rightDecoration = createScanLines(2000);

    this.sideElements.push(leftDecoration, rightDecoration);
    this.scene.add(leftDecoration);
    this.scene.add(rightDecoration);
  }

  private animateSideElements(time: number): void {
    this.sideElements.forEach((group, index) => {
      // Animate vertical lines
      group.children.forEach((child, childIndex) => {
        if (child instanceof THREE.Line && childIndex < 5) {
          child.material.opacity =
            0.2 + Math.sin(time * 0.001 + childIndex) * 0.1;
        }

        // Animate particles
        if (child instanceof THREE.Points) {
          child.rotation.y = time * 0.0001;
          const positions = child.geometry.attributes.position
            .array as Float32Array;
          for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(time * 0.001 + i) * 0.5;
            if (positions[i + 1] > 750) positions[i + 1] = -750;
          }
          child.geometry.attributes.position.needsUpdate = true;
        }

        // Animate grid
        if (child instanceof THREE.Group) {
          child.rotation.z = Math.sin(time * 0.0005) * 0.05;
        }
      });
    });
  }

  private setupVideo(): void {
    this.video = document.createElement('video');
    this.video.width = this.GRID_WIDTH;
    this.video.height = this.GRID_HEIGHT;
    this.video.autoplay = true;
    this.video.muted = true;
    this.video.loop = true;

    this.canvas2D = document.createElement('canvas');
    this.canvas2D.width = this.GRID_WIDTH;
    this.canvas2D.height = this.GRID_HEIGHT;
    this.ctx2D = this.canvas2D.getContext('2d')!;

    this.createAnimatedPattern();
  }

  private createAnimatedPattern(): void {
    const canvas = document.createElement('canvas');
    canvas.width = this.GRID_WIDTH;
    canvas.height = this.GRID_HEIGHT;
    const ctx = canvas.getContext('2d')!;

    let time = 0;
    const animate = () => {
      const imageData = ctx.createImageData(this.GRID_WIDTH, this.GRID_HEIGHT);
      const data = imageData.data;

      for (let y = 0; y < this.GRID_HEIGHT; y++) {
        for (let x = 0; x < this.GRID_WIDTH; x++) {
          const index = (y * this.GRID_WIDTH + x) * 4;
          const centerX = this.GRID_WIDTH / 2;
          const centerY = this.GRID_HEIGHT / 2;
          const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
          const wave = Math.sin(distance * 0.1 + time * 0.05) * 0.5 + 0.5;
          const noise =
            Math.sin(x * 0.1 + time * 0.02) * Math.cos(y * 0.1 + time * 0.03);
          const intensity = Math.max(
            0,
            Math.min(255, (wave + noise * 0.3) * 255),
          );

          data[index] = intensity;
          data[index + 1] = intensity * 0.8;
          data[index + 2] = intensity * 0.6;
          data[index + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      time++;
      requestAnimationFrame(animate);
    };

    animate();
    const stream = canvas.captureStream(30);
    this.video.srcObject = stream;
    this.video.play();
  }

  private updatePointCloud(): void {
    if (!this.video.videoWidth || !this.video.videoHeight) return;

    this.glitchTime++;
    if (Math.random() < 0.003) {
      this.glitchIntensity = Math.random() * 0.7 + 0.3;
      setTimeout(() => (this.glitchIntensity = 0), Math.random() * 1000 + 500);
    }

    this.ctx2D.drawImage(this.video, 0, 0, this.GRID_WIDTH, this.GRID_HEIGHT);
    const imageData = this.ctx2D.getImageData(
      0,
      0,
      this.GRID_WIDTH,
      this.GRID_HEIGHT,
    );
    const data = imageData.data;

    const positions = this.geometry.attributes['position']
      .array as Float32Array;
    const colors = this.geometry.attributes['color'].array as Float32Array;
    const originalPositions = this.geometry.attributes['originalPosition']
      .array as Float32Array;

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseWorldX =
      ((this.mouseX / rect.width) * 2 - 1) * (this.GRID_WIDTH * 6); // Adjusted for new scale
    const mouseWorldY =
      -((this.mouseY / rect.height) * 2 - 1) * (this.GRID_HEIGHT * 6); // Adjusted for new scale

    let index = 0;
    for (let y = 0; y < this.GRID_HEIGHT; y++) {
      for (let x = 0; x < this.GRID_WIDTH; x++) {
        const pixelIndex = (y * this.GRID_WIDTH + x) * 4;
        const r = data[pixelIndex];
        const g = data[pixelIndex + 1];
        const b = data[pixelIndex + 2];
        const brightness = (r + g + b) / 3;

        if (brightness <= 40) {
          positions[index * 3] = positions[index * 3 + 1] = 0;
          positions[index * 3 + 2] = -10000;
          colors[index * 3] = colors[index * 3 + 1] = colors[index * 3 + 2] = 0;
          index++;
          continue;
        }

        let depth = brightness / 255;
        depth = Math.pow(depth, 2.2);
        const baseZ = depth * 400 - 200;

        const originalX = originalPositions[index * 3];
        const originalY = originalPositions[index * 3 + 1];

        const distanceToMouse = Math.sqrt(
          Math.pow(originalX - mouseWorldX, 2) +
            Math.pow(originalY - mouseWorldY, 2),
        );

        let scatterX = 0,
          scatterY = 0,
          scatterZ = 0;
        if (this.isMouseOverCanvas && distanceToMouse < 50) {
          const scatterFactor = 1 - distanceToMouse / 50;
          const scatterIntensity = scatterFactor * 20;
          const deltaX = originalX - mouseWorldX;
          const deltaY = originalY - mouseWorldY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (distance > 0) {
            scatterX = (deltaX / distance) * scatterIntensity;
            scatterY = (deltaY / distance) * scatterIntensity;
            scatterZ = scatterIntensity * 0.2;
          }
        }

        // Glitch effect
        let glitchX = 0,
          glitchY = 0;
        if (
          this.glitchIntensity > 0 &&
          Math.random() < this.glitchIntensity * 0.1
        ) {
          glitchX = (Math.random() - 0.5) * this.glitchIntensity * 25;
          glitchY = (Math.random() - 0.5) * this.glitchIntensity * 25;
        }

        positions[index * 3] = originalX + scatterX + glitchX;
        positions[index * 3 + 1] = originalY + scatterY + glitchY;
        positions[index * 3 + 2] = baseZ + scatterZ;

        // Apply holographic colors
        this.applyHolographicColors(colors, index, brightness, distanceToMouse);
        index++;
      }
    }

    this.geometry.attributes['position'].needsUpdate = true;
    this.geometry.attributes['color'].needsUpdate = true;
    this.updateGlowLayers();
  }

  private applyHolographicColors(
    colors: Float32Array,
    index: number,
    brightness: number,
    distanceToMouse: number,
  ): void {
    let finalColor = [0.5, 0.5, 0.5]; // Default grey

    if (brightness > 220) finalColor = [1.0, 1.0, 1.0];
    else if (brightness > 180) finalColor = [0.9, 0.9, 0.9];
    else if (brightness > 140) finalColor = [0.7, 0.7, 0.7];
    else if (brightness > 100) finalColor = [0.5, 0.5, 0.5];
    else if (brightness > 60) finalColor = [0.3, 0.3, 0.3];
    else finalColor = [0.1, 0.1, 0.1];

    // Add subtle color variations
    const variation = (index % 7) / 20;
    finalColor[0] += variation * 0.1;
    finalColor[1] += variation * 0.05;
    finalColor[2] += variation * 0.15;

    // Mouse glow effect
    if (this.isMouseOverCanvas && distanceToMouse < 50) {
      const glowFactor = (1 - distanceToMouse / 50) * 0.6;
      finalColor[0] = Math.min(1.0, finalColor[0] + glowFactor * 0.7);
      finalColor[1] = Math.min(1.0, finalColor[1] + glowFactor * 0.8);
      finalColor[2] = Math.min(1.0, finalColor[2] + glowFactor * 1.0);
    }

    colors[index * 3] = finalColor[0];
    colors[index * 3 + 1] = finalColor[1];
    colors[index * 3 + 2] = finalColor[2];
  }

  private updateGlowLayers(): void {
    this.glowLayers.forEach((layer, layerIndex) => {
      const layerPositions = layer.geometry.attributes['position']
        .array as Float32Array;
      const layerColors = layer.geometry.attributes['color']
        .array as Float32Array;
      const mainPositions = this.geometry.attributes['position']
        .array as Float32Array;
      const mainColors = this.geometry.attributes['color']
        .array as Float32Array;

      for (let i = 0; i < mainPositions.length; i += 3) {
        layerPositions[i] = mainPositions[i];
        layerPositions[i + 1] = mainPositions[i + 1];
        layerPositions[i + 2] = mainPositions[i + 2] - (layerIndex + 1) * 2;
      }

      for (let i = 0; i < mainColors.length; i += 3) {
        const glowIntensity = 0.8 / (layerIndex + 1);
        layerColors[i] = mainColors[i] * glowIntensity;
        layerColors[i + 1] = mainColors[i + 1] * glowIntensity;
        layerColors[i + 2] = mainColors[i + 2] * glowIntensity;
      }

      layer.geometry.attributes['position'].needsUpdate = true;
      layer.geometry.attributes['color'].needsUpdate = true;
    });
  }

  private setupEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;

    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      this.mouseX = event.clientX - rect.left;
      this.mouseY = event.clientY - rect.top;
    });

    canvas.addEventListener(
      'mouseenter',
      () => (this.isMouseOverCanvas = true),
    );
    canvas.addEventListener(
      'mouseleave',
      () => (this.isMouseOverCanvas = false),
    );

    // Removed wheel event listener - no more zooming
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    const time = Date.now();
    this.updatePointCloud();
    this.animateSideElements(time);
    this.renderer.render(this.scene, this.camera);
  }

  private async loadVideoFromSrc(src: string): Promise<void> {
    this.video.srcObject = null;
    this.video.src = src;
    this.video.load();
    await this.video.play();
  }

  get isLoadingValue(): boolean {
    return this.isLoading();
  }
}
