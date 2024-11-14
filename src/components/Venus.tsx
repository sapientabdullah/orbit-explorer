import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Venus() {
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

    const venusGroup = new THREE.Group();
    venusGroup.rotation.y = (-0.034 * Math.PI) / 180;

    venusGroup.rotation.x = (177.4 * Math.PI) / 180;
    scene.add(venusGroup);

    const geometry = new THREE.IcosahedronGeometry(2.5, 12);
    const material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("/assets/venus/Color Map.jpg"),
    });
    const venus = new THREE.Mesh(geometry, material);
    venusGroup.add(venus);

    const bumpsMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("/assets/venus/Bump Map.jpg"),
      transparent: true,
      opacity: 0.1,
    });
    const bumps = new THREE.Mesh(geometry, bumpsMaterial);
    venusGroup.add(bumps);

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
      venus.rotation.y += 0.01;
      bumps.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, [dimensions]);

  return <canvas ref={canvasRef}></canvas>;
}
