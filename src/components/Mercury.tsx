import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Mercury() {
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

    const mercuryGroup = new THREE.Group();
    mercuryGroup.rotation.z = (-0.034 * Math.PI) / 180;
    scene.add(mercuryGroup);

    const geometry = new THREE.IcosahedronGeometry(2.5, 12);
    const material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("/assets/mercury/Color Map.jpg"),
    });
    const mercury = new THREE.Mesh(geometry, material);
    mercuryGroup.add(mercury);

    const bumpsMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("/assets/mercury/Bump Map.jpg"),
      transparent: true,
      opacity: 0.1,
    });
    const bumps = new THREE.Mesh(geometry, bumpsMaterial);
    mercuryGroup.add(bumps);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-2, 0, 1);
    scene.add(directionalLight);

    const glowGeometry = new THREE.SphereGeometry(2.56, 30, 30);
    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      emissive: 0xaaaaaa,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.15,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

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
      mercury.rotation.y += 0.001;
      bumps.rotation.y += 0.001;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, [dimensions]);

  return <canvas ref={canvasRef}></canvas>;
}
