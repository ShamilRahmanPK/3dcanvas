import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const ThreeCanvas = forwardRef(({ model, isVisible }, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const boundingBoxRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-1, -1, -1);
    scene.add(backLight);

    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    const handleResize = () => {
      if (mountRef.current && cameraRef.current && rendererRef.current) {
        const width = mountRef.current.clientWidth;
        const height = window.innerHeight;
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!model || !sceneRef.current) return;

    if (modelRef.current) {
      sceneRef.current.remove(modelRef.current);
    }

    const fileURL = URL.createObjectURL(model);
    const fileExtension = model.name.split('.').pop().toLowerCase();

    if (fileExtension === 'glb' || fileExtension === 'gltf') {
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
      loader.setDRACOLoader(dracoLoader);
      loader.load(
        fileURL,
        (gltf) => {
          modelRef.current = gltf.scene;
          sceneRef.current.add(modelRef.current);
          boundingBoxRef.current = new THREE.Box3().setFromObject(modelRef.current);
          fitToView();
        },
        undefined,
        (error) => console.error('Error loading GLTF model:', error)
      );
    } else if (fileExtension === 'obj') {
      const loader = new OBJLoader();
      loader.load(
        fileURL,
        (obj) => {
          modelRef.current = obj;
          sceneRef.current.add(modelRef.current);
          boundingBoxRef.current = new THREE.Box3().setFromObject(modelRef.current);
          fitToView();
        },
        undefined,
        (error) => console.error('Error loading OBJ model:', error)
      );
    }

    return () => URL.revokeObjectURL(fileURL);
  }, [model]);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.visible = isVisible;
    }
  }, [isVisible]);

  const fitToView = () => {
    if (!modelRef.current || !boundingBoxRef.current || !cameraRef.current || !controlsRef.current) {
      return;
    }
  
    // Compute bounding box and center
    boundingBoxRef.current.setFromObject(modelRef.current);
    const center = new THREE.Vector3();
    boundingBoxRef.current.getCenter(center);
    
    // Compute size and max dimension
    const size = new THREE.Vector3();
    boundingBoxRef.current.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Compute bounding sphere for more accurate scaling
    const boundingSphere = new THREE.Sphere();
    boundingBoxRef.current.getBoundingSphere(boundingSphere);
    const modelRadius = boundingSphere.radius;
  
    // Adjust camera distance
    const fov = cameraRef.current.fov * (Math.PI / 180);
    let cameraDistance = modelRadius / Math.sin(fov / 2);
    cameraDistance *= 1.2; // Add slight padding
  
    // Set camera position
    cameraRef.current.position.set(center.x, center.y + cameraDistance * 0.5, center.z + cameraDistance);
    cameraRef.current.lookAt(center);
  
    // Adjust controls
    controlsRef.current.target.copy(center);
    controlsRef.current.update();
  };
  

  useImperativeHandle(ref, () => ({ fitToView }));

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
      }}
    />
  );
});

export default ThreeCanvas;