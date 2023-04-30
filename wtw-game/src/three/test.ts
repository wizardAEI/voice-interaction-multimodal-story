import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

export function init() {
  /**
   * Base
   */
  // Canvas
  const canvas = document.querySelector(".webgl-canvas") as HTMLCanvasElement;

  // Scene
  const scene = new THREE.Scene();

  /**
   * Object
   */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  window.addEventListener("resize", () => {
    // update camera
    sizes.height = window.innerHeight;
    sizes.width = window.innerWidth;

    //update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    //update renderer
    renderer.setSize(sizes.width, sizes.height);

    //update Ratio
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
  });

  /**
   * double click to fullScreen
   */
  window.addEventListener("dblclick", () => {
    const fullScreen = document.fullscreenElement;
    if (!fullScreen) {
      if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.z = 3;
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3)); // fix pixelRatio

  /**
   * Animate
   */
  const clock = new THREE.Clock();

  /**
   * actions
   */
  const jump = () => {
    console.log("xxxxx");
    gsap.to(mesh.position, {
      y: 1,
      duration: .5,
      ease: "power3.out",
    });
    setTimeout(() => {
      gsap.to(mesh.position, {
        y: 0,
        ease: "power2.in",
        duration: .5,
      });
    }, 500);
  };
  const turn = (direction: 'left' | 'right') => {
    console.log('>>>>', direction)
    if(direction === 'right') {
        gsap.to(mesh.rotation, {
            y: mesh.rotation.y + Math.PI,
            duration: 1
        })
        console.log(mesh.rotation)
    } else {
        gsap.to(mesh.rotation, {
            y: mesh.rotation.y - Math.PI,
            duration: 1
        })
    }
  }

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();

  return {
    mesh,
    jump,
    turn 
  };
}
