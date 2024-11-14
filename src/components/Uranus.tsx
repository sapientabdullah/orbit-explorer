import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Uranus() {
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

    const uranusGroup = new THREE.Group();
    uranusGroup.rotation.z = (98 * Math.PI) / 180;
    scene.add(uranusGroup);

    const geometry = new THREE.IcosahedronGeometry(2.5, 12);
    const material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("/assets/uranus/Color Map.jpg"),
    });
    const uranus = new THREE.Mesh(geometry, material);
    uranusGroup.add(uranus);

    const ringMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("/assets/uranus/Ring.png"),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
    });

    const innerRadius = 3.5;
    const outerRadius = 5;
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    ringGeometry.rotateX(Math.PI / 2);

    const uranusRing = new THREE.Mesh(ringGeometry, ringMaterial);

    uranusGroup.add(uranusRing);

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
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const glowGeometry = new THREE.SphereGeometry(2.56, 30, 30);
    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffcc,
      emissive: 0x00ffcc,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.1,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const animate = () => {
      requestAnimationFrame(animate);
      uranus.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, [dimensions]);

  return <canvas ref={canvasRef}></canvas>;
}
