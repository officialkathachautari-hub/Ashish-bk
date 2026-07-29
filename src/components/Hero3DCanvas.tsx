import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Helper function to create 3D book cover texture with "कथा चौतारी by Ashish BK"
const createBookCoverCanvas = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1433; // 2.0 : 2.8 aspect ratio matching 3D BoxGeometry
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Dark Crimson leather background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1433);
    bgGrad.addColorStop(0, '#881337');
    bgGrad.addColorStop(0.5, '#4c0519');
    bgGrad.addColorStop(1, '#2e020d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 1433);

    // Subtle leather grain texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    for (let i = 0; i < 25000; i++) {
      const rx = Math.random() * 1024;
      const ry = Math.random() * 1433;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // 2. Gold filigree frame
    const goldGrad = ctx.createLinearGradient(0, 0, 1024, 1433);
    goldGrad.addColorStop(0, '#fef08a');
    goldGrad.addColorStop(0.2, '#f59e0b');
    goldGrad.addColorStop(0.5, '#fef08a');
    goldGrad.addColorStop(0.8, '#d97706');
    goldGrad.addColorStop(1, '#fde047');

    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 14;
    ctx.strokeRect(60, 60, 904, 1313);

    ctx.lineWidth = 4;
    ctx.strokeRect(84, 84, 856, 1265);

    // Corner ornate accents
    const drawCorner = (x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = goldGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(90, 0);
      ctx.lineTo(0, 90);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    drawCorner(84, 84, 0);
    drawCorner(940, 84, Math.PI / 2);
    drawCorner(940, 1349, Math.PI);
    drawCorner(84, 1349, -Math.PI / 2);

    // 3. Central Crest / Emblem
    ctx.save();
    ctx.translate(512, 450);

    // Outer Gold Ring
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 110, 0, Math.PI * 2);
    ctx.fill();

    // Inner Dark Ring
    ctx.fillStyle = '#4c0519';
    ctx.beginPath();
    ctx.arc(0, 0, 92, 0, Math.PI * 2);
    ctx.fill();

    // Book icon
    ctx.fillStyle = goldGrad;
    ctx.font = 'bold 80px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📖', 0, 4);
    ctx.restore();

    // 4. Main Title "कथा चौतारी"
    ctx.fillStyle = goldGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;

    ctx.textAlign = 'center';
    ctx.font = 'bold 104px "Noto Sans Devanagari", sans-serif';
    ctx.fillText('कथा चौतारी', 512, 750);

    // Decorative Line
    ctx.lineWidth = 3;
    ctx.strokeStyle = goldGrad;
    ctx.beginPath();
    ctx.moveTo(260, 830);
    ctx.lineTo(764, 830);
    ctx.stroke();

    // Small Diamond on line center
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.arc(512, 830, 8, 0, Math.PI * 2);
    ctx.fill();

    // 5. Author Name "by Ashish BK"
    ctx.shadowBlur = 12;
    ctx.font = 'bold 58px "Noto Sans Devanagari", sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('by Ashish BK', 512, 940);

    ctx.font = '600 36px "Noto Sans Devanagari", sans-serif';
    ctx.fillStyle = '#fcd34d';
    ctx.fillText('नेपाली कथा संसार', 512, 1020);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

export const Hero3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.25, 4.0);
    camera.lookAt(0, 0.22, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfbbf24, 2.5);
    dirLight.position.set(3, 5, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xf43f5e, 3, 10);
    pointLight.position.set(-2, 1, 2);
    scene.add(pointLight);

    // Create 3D Book Group
    const bookGroup = new THREE.Group();

    // Book cover material (Warm Crimson / Gold leather look)
    const coverMaterial = new THREE.MeshStandardMaterial({
      color: 0x881337, // Rose-900 / Deep Crimson
      roughness: 0.3,
      metalness: 0.2,
    });

    const pagesMaterial = new THREE.MeshStandardMaterial({
      color: 0xfffdfa, // Warm Paper White
      roughness: 0.8,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbbf24, // Amber gold accents
      roughness: 0.2,
      metalness: 0.8,
    });

    // Main Book Cover Base (Back & Front)
    const coverGeometry = new THREE.BoxGeometry(2.0, 0.08, 2.8);
    const backCover = new THREE.Mesh(coverGeometry, coverMaterial);
    backCover.position.y = -0.16;
    backCover.castShadow = true;
    bookGroup.add(backCover);

    const frontCover = new THREE.Mesh(coverGeometry, coverMaterial);
    frontCover.position.y = 0.16;
    frontCover.castShadow = true;
    bookGroup.add(frontCover);

    // Front Cover Top Plate with "कथा चौतारी by Ashish BK" Texture
    const coverTexture = createBookCoverCanvas();
    const topPlateGeo = new THREE.PlaneGeometry(2.0, 2.8);
    const topPlateMat = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.35,
      metalness: 0.25,
    });
    const topPlateMesh = new THREE.Mesh(topPlateGeo, topPlateMat);
    topPlateMesh.rotation.x = -Math.PI / 2;
    topPlateMesh.position.set(0, 0.201, 0);
    bookGroup.add(topPlateMesh);

    // Book Pages (Inner block)
    const pagesGeometry = new THREE.BoxGeometry(1.9, 0.28, 2.7);
    const pagesMesh = new THREE.Mesh(pagesGeometry, pagesMaterial);
    pagesMesh.position.set(0.04, 0, 0);
    pagesMesh.castShadow = true;
    bookGroup.add(pagesMesh);

    // Book Spine
    const spineGeometry = new THREE.CylinderGeometry(0.18, 0.18, 2.8, 16, 1, false, Math.PI / 2, Math.PI);
    const spineMesh = new THREE.Mesh(spineGeometry, coverMaterial);
    spineMesh.rotation.x = Math.PI / 2;
    spineMesh.position.set(-0.98, 0, 0);
    bookGroup.add(spineMesh);

    // Gold Corner Accents
    const cornerGeo = new THREE.BoxGeometry(0.2, 0.1, 0.2);
    [
      [0.9, 0.17, 1.3],
      [0.9, 0.17, -1.3],
      [0.9, -0.17, 1.3],
      [0.9, -0.17, -1.3],
    ].forEach(([x, y, z]) => {
      const corner = new THREE.Mesh(cornerGeo, goldMaterial);
      corner.position.set(x, y, z);
      bookGroup.add(corner);
    });

    // Bookmark Ribbon
    const ribbonGeo = new THREE.BoxGeometry(0.12, 0.02, 1.8);
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.set(0.3, 0.18, 0.8);
    ribbon.rotation.y = 0.15;
    bookGroup.add(ribbon);

    // Floating Magical Particles around book
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Add book to scene
    bookGroup.rotation.x = 0.4;
    bookGroup.rotation.y = -0.5;
    scene.add(bookGroup);

    // Base initial rotation offset
    let userDragRotationY = -0.5;
    let targetRotationX = 0.4;
    let targetRotationY = -0.5;
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const calculateTargetRotation = () => {
      const currentScrollY = window.scrollY;
      // Every 400px of scrolling rotates the book 360 degrees (2 * Math.PI)
      const scrollRotationY = (currentScrollY / 400) * (Math.PI * 2);

      if (!isDragging) {
        targetRotationY = userDragRotationY + scrollRotationY + mouseX * 0.4;
        targetRotationX = 0.4 - mouseY * 0.3 + Math.sin(currentScrollY * 0.003) * 0.2;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        userDragRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      } else {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        calculateTargetRotation();
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Scroll Interaction (Full 360° rotation based on scroll position)
    const onScroll = () => {
      calculateTargetRotation();
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;

        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Handle Resize
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Gentle floating motion (positioned higher in center)
      bookGroup.position.y = 0.22 + Math.sin(elapsedTime * 1.5) * 0.08;

      // Calculate target rotation from scroll & drag
      calculateTargetRotation();

      // Slow idle spin added to base offset
      if (!isDragging) {
        userDragRotationY += 0.0015;
      }

      // Smooth rotation interpolation
      bookGroup.rotation.y += (targetRotationY - bookGroup.rotation.y) * 0.08;
      bookGroup.rotation.x += (targetRotationX - bookGroup.rotation.x) * 0.08;

      // Rotate particles
      particles.rotation.y = elapsedTime * 0.05;
      particles.rotation.x = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries & materials
      coverGeometry.dispose();
      topPlateGeo.dispose();
      pagesGeometry.dispose();
      spineGeometry.dispose();
      cornerGeo.dispose();
      ribbonGeo.dispose();
      particleGeo.dispose();
      coverMaterial.dispose();
      topPlateMat.dispose();
      coverTexture.dispose();
      pagesMaterial.dispose();
      goldMaterial.dispose();
      ribbonMat.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      id="hero-3d-canvas"
      className="w-full h-[380px] md:h-[420px] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing relative select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30 text-[11px] text-amber-300 font-medium pointer-events-none flex items-center gap-1.5 z-10">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>३D पुस्तक (३६०° घुमाउनुहोस्)</span>
      </div>

      <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-500/30 flex items-center justify-between text-xs text-amber-300 shadow-xl z-10">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">📖</span>
          <div>
            <h4 className="font-black text-white text-sm">कथा चौतारी</h4>
            <p className="text-[11px] text-amber-300 font-semibold">by Ashish BK</p>
          </div>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
          ३D संस्करण
        </span>
      </div>
    </div>
  );
};

