import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function SolarSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  interface CelestialBody {
    mesh: THREE.Mesh;
    url: string;
  }

  const celestialBodies: CelestialBody[] = [];

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
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(width, height);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    camera.position.set(-90, 140, 140);
    controls.update();

    const textureLoader = new THREE.TextureLoader();
    const sunGeometry = new THREE.SphereGeometry(16, 30, 30);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load("src/assets/sun/Color Map.jpg"),
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    const glowGeometry = new THREE.SphereGeometry(16.5, 30, 30);
    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.3,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    celestialBodies.push({ mesh: sun, url: "/sun" });

    const createPlanets = (
      size: number,
      texture: string,
      position: number,
      url: string,
      ring?: { innerRadius: number; outerRadius: number; texture: string }
    ) => {
      const geo = new THREE.SphereGeometry(size, 30, 30);
      const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture),
      });
      const mesh = new THREE.Mesh(geo, mat);
      const obj = new THREE.Object3D();
      obj.add(mesh);

      if (ring) {
        const ringGeo = new THREE.RingGeometry(
          ring.innerRadius,
          ring.outerRadius,
          32
        );
        const ringMat = new THREE.MeshBasicMaterial({
          map: textureLoader.load(ring.texture),
          side: THREE.DoubleSide,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
      }

      scene.add(obj);
      celestialBodies.push({ mesh, url });
      mesh.position.x = position;
      return { mesh, obj };
    };

    const mercury = createPlanets(
      3.2,
      "src/assets/mercury/Color Map.jpg",
      28,
      "/mercury"
    );
    const venus = createPlanets(5.8, "src/assets/Venus (1).jpg", 44, "/venus");
    const earth = createPlanets(
      6,
      "src/assets/earth/Earth Texture Map.jpg",
      62,
      "/earth"
    );
    const mars = createPlanets(4, "src/assets/mars/Color Map.jpg", 78, "/mars");
    const jupiter = createPlanets(
      12,
      "src/assets/jupiter/Jupiter Texture Map 4K.jpg",
      100,
      "/jupiter"
    );
    const saturn = createPlanets(
      10,
      "src/assets/Saturn (1).jpg",
      138,
      "/saturn",
      {
        innerRadius: 10,
        outerRadius: 20,
        texture: "src/assets/Saturn Ring (1).png",
      }
    );
    const uranus = createPlanets(
      7,
      "src/assets/uranus/Color Map.jpg",
      176,
      "/uranus",
      {
        innerRadius: 7,
        outerRadius: 12,
        texture: "src/assets/uranus/Ring.png",
      }
    );
    const neptune = createPlanets(
      7,
      "src/assets/Neptune (1).jpg",
      200,
      "/neptune"
    );
    const pluto = createPlanets(
      2.8,
      "src/assets/pluto/Color Map.jpg",
      216,
      "/pluto"
    );

    function createOrbitPath(radius: number, thickness: number = 0.2) {
      const orbitGeometry = new THREE.RingGeometry(
        radius - thickness,
        radius + thickness,
        64
      );
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = -0.5 * Math.PI;
      scene.add(orbit);
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseMove(event: MouseEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        celestialBodies.map((b) => b.mesh)
      );

      if (intersects.length > 0) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    }

    function onMouseClick(event: MouseEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        celestialBodies.map((p) => p.mesh)
      );

      if (intersects.length > 0) {
        const clickedPlanet = celestialBodies.find(
          (p) => p.mesh === intersects[0].object
        );
        if (clickedPlanet) {
          navigate(clickedPlanet.url);
        }
      }
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onMouseClick);

    createOrbitPath(28);
    createOrbitPath(44);
    createOrbitPath(62);
    createOrbitPath(78);
    createOrbitPath(100);
    createOrbitPath(138);
    createOrbitPath(176);
    createOrbitPath(200);
    createOrbitPath(216);

    const animate = () => {
      sun.rotateY(0.004);
      mercury.mesh.rotateY(0.004);
      venus.mesh.rotateY(0.002);
      earth.mesh.rotateY(0.02);
      mars.mesh.rotateY(0.018);
      jupiter.mesh.rotateY(0.04);
      saturn.mesh.rotateY(0.038);
      uranus.mesh.rotateY(0.03);
      neptune.mesh.rotateY(0.032);
      pluto.mesh.rotateY(0.008);
      mercury.obj.rotateY(0.04);
      venus.obj.rotateY(0.015);
      earth.obj.rotateY(0.01);
      mars.obj.rotateY(0.008);
      jupiter.obj.rotateY(0.002);
      saturn.obj.rotateY(0.0009);
      uranus.obj.rotateY(0.0004);
      neptune.obj.rotateY(0.0001);
      pluto.obj.rotateY(0.00007);

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

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
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onMouseClick);
    };
  }, [dimensions, navigate]);

  return (
    <div style={{ position: "relative" }}>
      <canvas ref={canvasRef} />
      <Navbar />
    </div>
  );
}
