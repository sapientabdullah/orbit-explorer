import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Jupiter() {
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
    const material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(
        "/assets/jupiter/Jupiter Texture Map 4K.jpg"
      ),
    });
    const jupiter = new THREE.Mesh(geometry, material);

    jupiter.rotation.z = (3.13 * Math.PI) / 180;

    scene.add(jupiter);

    const glowGeometry = new THREE.SphereGeometry(2.65, 30, 30);
    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.1,
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
      jupiter.rotation.y += 0.004;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, [dimensions]);

  return <canvas ref={canvasRef}></canvas>;
}
