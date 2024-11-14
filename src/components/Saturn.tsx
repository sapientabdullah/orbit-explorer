import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Saturn() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const { width, height } = dimensions;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(width, height);

    const saturnGroup = new THREE.Group();
    saturnGroup.rotation.z = (26.7 * Math.PI) / 180;
    scene.add(saturnGroup);

    const geometry = new THREE.IcosahedronGeometry(2.5, 12);
    const material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("/assets/saturn/Color Map.jpg"),
    });
    const saturn = new THREE.Mesh(geometry, material);
    saturnGroup.add(saturn);

    // Saturn's rings
    const ringMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("/assets/saturn/Ring.png"),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
    });

    const innerRadius = 3.5;
    const outerRadius = 5;
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    ringGeometry.rotateX(Math.PI / 2 + (26.7 * Math.PI) / 180);

    const saturnRing = new THREE.Mesh(ringGeometry, ringMaterial);
    saturnGroup.add(saturnRing);

    const starsTextureUrl = "/assets/Stars from Solar System.jpg";
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    scene.background = cubeTextureLoader.load([
      starsTextureUrl,
      starsTextureUrl,
      starsTextureUrl,
      starsTextureUrl,
      starsTextureUrl,
      starsTextureUrl,
    ]);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-2, 0, 1);
    scene.add(directionalLight);

    const glowGeometry = new THREE.SphereGeometry(2.56, 30, 30);
    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      emissive: 0xffcc00,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.2,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      saturn.rotation.y -= 0.01;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, [dimensions]);

  return <canvas ref={canvasRef}></canvas>;
}
