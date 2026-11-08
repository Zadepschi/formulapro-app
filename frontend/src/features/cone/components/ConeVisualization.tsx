import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ConeVisualizationProps {
  radius: number;
  height: number;
}

export default function ConeVisualization({
  radius,
  height,
}: ConeVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let animationId = 0;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      1,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    const coneGroup = new THREE.Group();
    scene.add(coneGroup);

    // Освещение
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      1.5
    );

    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      2
    );

    directionalLight.position.set(5, 8, 6);
    scene.add(directionalLight);

    // Геометрия конуса
    const coneGeometry = new THREE.ConeGeometry(
      radius,
      height,
      64,
      1,
      false
    );

    const coneMaterial = new THREE.MeshPhongMaterial({
      color: 0xffa500,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      shininess: 80,
    });

    const coneMesh = new THREE.Mesh(
      coneGeometry,
      coneMaterial
    );

    // Основание конуса находится на уровне y = 0
    coneMesh.position.y = height / 2;

    coneGroup.add(coneMesh);

    // Каркас конуса
    const wireGeometry = new THREE.EdgesGeometry(
      coneGeometry
    );

    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
    });

    const wireframe = new THREE.LineSegments(
      wireGeometry,
      wireMaterial
    );

    wireframe.position.y = height / 2;

    coneGroup.add(wireframe);

    // Окружность основания
    const circlePoints: THREE.Vector3[] = [];

    for (let i = 0; i <= 100; i++) {
      const angle = (i / 100) * Math.PI * 2;

      circlePoints.push(
        new THREE.Vector3(
          radius * Math.cos(angle),
          0,
          radius * Math.sin(angle)
        )
      );
    }

    const circleGeometry = new THREE.BufferGeometry()
      .setFromPoints(circlePoints);

    const circleMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });

    const baseCircle = new THREE.Line(
      circleGeometry,
      circleMaterial
    );

    coneGroup.add(baseCircle);

    // Красная линия радиуса
    const radiusGeometry = new THREE.BufferGeometry()
      .setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(radius, 0, 0),
      ]);

    const radiusMaterial = new THREE.LineBasicMaterial({
      color: 0xff3333,
    });

    const radiusLine = new THREE.Line(
      radiusGeometry,
      radiusMaterial
    );

    coneGroup.add(radiusLine);

    // Зелёная линия высоты
    const heightGeometry = new THREE.BufferGeometry()
      .setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, height, 0),
      ]);

    const heightMaterial = new THREE.LineBasicMaterial({
      color: 0x22cc66,
    });

    const heightLine = new THREE.Line(
      heightGeometry,
      heightMaterial
    );

    coneGroup.add(heightLine);

    // Точка вершины
    const apexGeometry = new THREE.SphereGeometry(
      Math.max(radius, height) * 0.018,
      16,
      16
    );

    const apexMaterial = new THREE.MeshBasicMaterial({
      color: 0x22cc66,
    });

    const apex = new THREE.Mesh(
      apexGeometry,
      apexMaterial
    );

    apex.position.set(0, height, 0);
    coneGroup.add(apex);

    // Масштабирование модели
    const maxDimension = Math.max(radius * 2, height);
    const scale = 5 / maxDimension;

    coneGroup.scale.setScalar(scale);

    // Центрирование камеры
    const centerY = (height / 2) * scale;

    camera.position.set(
      7,
      centerY + 5,
      9
    );

    camera.lookAt(0, centerY, 0);

    // Изменение размера
    const resizeRenderer = () => {
      const width = container.clientWidth;
      const currentHeight = container.clientHeight;

      if (!width || !currentHeight) return;

      renderer.setSize(width, currentHeight);

      camera.aspect = width / currentHeight;
      camera.updateProjectionMatrix();
    };

    resizeRenderer();

    const resizeObserver = new ResizeObserver(
      resizeRenderer
    );

    resizeObserver.observe(container);

    // Анимация
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      coneGroup.rotation.y += 0.008;

      renderer.render(scene, camera);
    };

    animate();

    // Очистка ресурсов
    return () => {
      cancelAnimationFrame(animationId);

      resizeObserver.disconnect();

      coneGeometry.dispose();
      coneMaterial.dispose();

      wireGeometry.dispose();
      wireMaterial.dispose();

      circleGeometry.dispose();
      circleMaterial.dispose();

      radiusGeometry.dispose();
      radiusMaterial.dispose();

      heightGeometry.dispose();
      heightMaterial.dispose();

      apexGeometry.dispose();
      apexMaterial.dispose();

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [radius, height]);

  return (
    <div className="cone-visualization">
      <div
        className="cone-visualization__canvas"
        ref={containerRef}
      />

      <div className="cone-visualization__legend">
        <span>
          <i className="cone-legend-radius" />
          r
        </span>

        <span>
          <i className="cone-legend-height" />
          h
        </span>
      </div>
    </div>
  );
}