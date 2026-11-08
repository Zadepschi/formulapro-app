
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface PrismVisualizationProps {
  length: number;
  width: number;
  height: number;
}

export default function PrismVisualization({
  length,
  width,
  height,
}: PrismVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId = 0;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const prismGroup = new THREE.Group();
    scene.add(prismGroup);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(5, 8, 6);
    scene.add(light);

    // Параллелепипед
    const geometry = new THREE.BoxGeometry(length, height, width);

    const material = new THREE.MeshPhongMaterial({
      color: 0xb13bff,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    prismGroup.add(mesh);

    // Белый каркас
    const edgesGeometry = new THREE.EdgesGeometry(geometry);

    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });

    const wireframe = new THREE.LineSegments(
      edgesGeometry,
      edgesMaterial
    );

    prismGroup.add(wireframe);

    // Вспомогательная функция для размерных линий
    const addDimension = (
      start: THREE.Vector3,
      end: THREE.Vector3,
      color: number,
      label: string
    ) => {
      const points = [start, end];

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

      const lineMaterial = new THREE.LineBasicMaterial({
        color,
        depthTest: false,
      });

      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.renderOrder = 2;
      prismGroup.add(line);

      // Небольшие отметки на концах линии
      const direction = new THREE.Vector3()
        .subVectors(end, start)
        .normalize();

      const perpendicular = new THREE.Vector3(
        0,
        0,
        1
      );

      if (Math.abs(direction.dot(perpendicular)) > 0.9) {
        perpendicular.set(0, 1, 0);
      }

      perpendicular.cross(direction).normalize();

      const tickSize =
        Math.max(length, width, height) * 0.025;

      [start, end].forEach((point) => {
        const tickGeometry = new THREE.BufferGeometry().setFromPoints([
          point.clone().addScaledVector(perpendicular, -tickSize),
          point.clone().addScaledVector(perpendicular, tickSize),
        ]);

        const tick = new THREE.Line(
          tickGeometry,
          lineMaterial
        );

        tick.renderOrder = 2;
        prismGroup.add(tick);
      });

      // Подпись размера
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 64;

      const context = canvas.getContext("2d");

      if (context) {
        context.clearRect(0, 0, 128, 64);
        context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
        context.font = "bold 42px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(label, 64, 32);
      }

      const texture = new THREE.CanvasTexture(canvas);

      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      });

      const sprite = new THREE.Sprite(spriteMaterial);

      sprite.position.copy(start).add(end).multiplyScalar(0.5);

      sprite.position.addScaledVector(
        perpendicular,
        tickSize * 4
      );

      sprite.scale.set(
        Math.max(length, width, height) * 0.3,
        Math.max(length, width, height) * 0.15,
        1
      );

      sprite.renderOrder = 3;
      prismGroup.add(sprite);
    };

    // Размер a — длина
    addDimension(
      new THREE.Vector3(-length / 2, -height / 2 - 0.15, width / 2),
      new THREE.Vector3(length / 2, -height / 2 - 0.15, width / 2),
      0xff3333,
      "a"
    );

    // Размер b — ширина
    addDimension(
      new THREE.Vector3(-length / 2, -height / 2, -width / 2 - 0.15),
      new THREE.Vector3(-length / 2, -height / 2, width / 2),
      0x3399ff,
      "b"
    );

    // Размер h — высота
    addDimension(
      new THREE.Vector3(length / 2 + 0.15, -height / 2, width / 2),
      new THREE.Vector3(length / 2 + 0.15, height / 2, width / 2),
      0x22cc66,
      "h"
    );

    // Масштабирование
    const maxDimension = Math.max(length, width, height);
    const scale = 5 / maxDimension;

    prismGroup.scale.setScalar(scale);

    camera.position.set(8, 7, 9);
    camera.lookAt(0, 0, 0);

    const resizeRenderer = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;

      if (!w || !h) return;

      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    resizeRenderer();

    const observer = new ResizeObserver(resizeRenderer);
    observer.observe(container);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      prismGroup.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();

      prismGroup.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Sprite) {
          object.geometry?.dispose();

          const materials = Array.isArray(object.material)
            ? object.material
            : object.material
              ? [object.material]
              : [];

          materials.forEach((item) => {
            if ("map" in item && item.map) {
              item.map.dispose();
            }
            item.dispose();
          });
        }
      });

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [length, width, height]);

  return (
    <div className="prism-visualization">
      <div
        className="prism-visualization__canvas"
        ref={containerRef}
      />

      <div className="prism-visualization__legend">
        <span><i className="prism-legend-a" /> a</span>
        <span><i className="prism-legend-b" /> b</span>
        <span><i className="prism-legend-h" /> h</span>
      </div>
    </div>
  );
}
