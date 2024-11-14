import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Neptune() {
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

    const neptuneGroup = new THREE.Group();
    neptuneGroup.rotation.z = (28.3 * Math.PI) / 180;
    scene.add(neptuneGroup);

    const geometry = new THREE.IcosahedronGeometry(2.5, 12);
    const material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("/assets/neptune/Color Map.jpg"),
    });
    const neptune = new THREE.Mesh(geometry, material);
    neptuneGroup.add(neptune);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-2, 0, 1);
    directionalLight.castShadow = true;
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
      neptuneGroup.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, [dimensions]);

  return <canvas ref={canvasRef}></canvas>;
}
