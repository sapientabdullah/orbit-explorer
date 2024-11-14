import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Sun() {
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

    const geometry = new THREE.SphereGeometry(2.6, 30, 30);
    const material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("/assets/sun/Color Map.jpg"),
    });
    const sun = new THREE.Mesh(geometry, material);

    sun.rotation.z = (7.25 * Math.PI) / 180;

    scene.add(sun);

    const glowGeometry = new THREE.SphereGeometry(2.64, 30, 30);
    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.3,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-2, 0, 1);
    scene.add(directionalLight);

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

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const animate = () => {
      requestAnimationFrame(animate);
      sun.rotation.y += 0.004;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, [dimensions]);

  return <canvas ref={canvasRef}></canvas>;
}
