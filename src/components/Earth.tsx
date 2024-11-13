import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Earth() {
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

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
    scene.add(earthGroup);

    const geometry = new THREE.IcosahedronGeometry(2.5, 12);
    const material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(
        "src/assets/earth/Earth Texture Map.jpg"
      ),
    });
    const earth = new THREE.Mesh(geometry, material);
    earthGroup.add(earth);

    const lightsMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(
        "src/assets/earth/Earth Lights Texture Map.jpg"
      ),
      blending: THREE.AdditiveBlending,
    });

    const lights = new THREE.Mesh(geometry, lightsMaterial);
    earthGroup.add(lights);

    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(
        "src/assets/earth/Earth Cloud Map Texture.jpg"
      ),
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });

    const clouds = new THREE.Mesh(geometry, cloudsMaterial);
    clouds.scale.setScalar(1.005);
    earthGroup.add(clouds);

    const bumpsMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(
        "src/assets/earth/Earth Bump Texture 1k.jpg"
      ),
      transparent: true,
    });

    const bumps = new THREE.Mesh(geometry, bumpsMaterial);
    earthGroup.add(bumps);

    const iceMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("src/assets/earth/Earth Ice Map.jpg"),
      transparent: true,
      opacity: 1,
    });

    const ice = new THREE.Mesh(geometry, iceMaterial);
    earthGroup.add(ice);

    const glowGeometry = new THREE.SphereGeometry(2.56, 30, 30);
    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e90ff, 
      emissive: 0x1e90ff, 
      emissiveIntensity: 0.6, 
      transparent: true,
      opacity: 0.2, 
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-2, 0, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const starsTextureUrl = "src/assets/Stars from Solar System.jpg";
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
      earth.rotation.y += 0.01;
      lights.rotation.y += 0.01;
      bumps.rotation.y += 0.01;
      ice.rotation.y += 0.01;
      clouds.rotation.y += 0.014;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, [dimensions]);

  return <canvas ref={canvasRef}></canvas>;
}
