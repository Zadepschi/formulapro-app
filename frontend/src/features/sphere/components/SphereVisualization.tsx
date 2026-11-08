import { useEffect, useRef } from "react";
import * as THREE from "three";

interface SphereVisualizationProps {
  radius: number;
}

export default function SphereVisualization({
  radius,
}: SphereVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let animationFrameId = 0;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      1,
      0.1,
      100,
    );

    camera.position.set(2.8, 2.1, 3.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2),
    );

    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Освещение

    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      1.2,
    );

    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      1.5,
    );

    directionalLight.position.set(3, 4, 5);
    scene.add(directionalLight);

    // Геометрия сферы

    const sphereGeometry = new THREE.SphereGeometry(
      1,
      48,
      48,
    );

    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x2fc7ff,
      transparent: true,
      opacity: 0.16,
      shininess: 80,
      side: THREE.DoubleSide,
    });

    const sphere = new THREE.Mesh(
      sphereGeometry,
      sphereMaterial,
    );

    sphereGroup.add(sphere);

    // Каркас сферы

    const wireframeGeometry = new THREE.WireframeGeometry(
      sphereGeometry,
    );

    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x2fc7ff,
      transparent: true,
      opacity: 0.55,
    });

    const wireframe = new THREE.LineSegments(
      wireframeGeometry,
      wireframeMaterial,
    );

    sphereGroup.add(wireframe);

    // Красный радиус

    const radiusGeometry = new THREE.BufferGeometry();

    const radiusPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 0, 0),
    ];

    radiusGeometry.setFromPoints(radiusPoints);

    const radiusMaterial = new THREE.LineBasicMaterial({
      color: 0xff3030,
      linewidth: 3,
    });

    const radiusLine = new THREE.Line(
      radiusGeometry,
      radiusMaterial,
    );

    sphereGroup.add(radiusLine);

    // Центр сферы

    const centerGeometry = new THREE.SphereGeometry(
      0.035,
      16,
      16,
    );

    const centerMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3030,
    });

    const center = new THREE.Mesh(
      centerGeometry,
      centerMaterial,
    );

    sphereGroup.add(center);

    // Обозначение радиуса R

    const labelCanvas = document.createElement("canvas");

    labelCanvas.width = 128;
    labelCanvas.height = 128;

    const context = labelCanvas.getContext("2d");

    if (context) {
      context.clearRect(0, 0, 128, 128);
      context.fillStyle = "#ff3030";
      context.font = "bold 64px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("R", 64, 64);
    }

    const labelTexture = new THREE.CanvasTexture(
      labelCanvas,
    );

    const labelMaterial = new THREE.SpriteMaterial({
      map: labelTexture,
      transparent: true,
    });

    const label = new THREE.Sprite(labelMaterial);

    label.position.set(0.58, 0.18, 0);
    label.scale.set(0.35, 0.35, 1);

    sphereGroup.add(label);

    // Обновление размеров

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(container);

    resize();

    // Анимация

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      sphereGroup.rotation.y += 0.004;

      renderer.render(scene, camera);
    };

    animate();

    // Очистка ресурсов

    return () => {
      cancelAnimationFrame(animationFrameId);

      resizeObserver.disconnect();

      sphereGeometry.dispose();
      sphereMaterial.dispose();

      wireframeGeometry.dispose();
      wireframeMaterial.dispose();

      radiusGeometry.dispose();
      radiusMaterial.dispose();

      centerGeometry.dispose();
      centerMaterial.dispose();

      labelTexture.dispose();
      labelMaterial.dispose();

      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [radius]);

  return (
    <div className="sphere-visualization">
      <div
        className="sphere-visualization__canvas"
        ref={containerRef}
      />

      <div className="sphere-visualization__legend">
        <span className="sphere-visualization__legend-dot" />
        <span>R = {radius}</span>
      </div>
    </div>
  );
}