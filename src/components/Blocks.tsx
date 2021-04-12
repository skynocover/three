import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import '../App.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as THREE from 'three';
import { AppContext, blockSettings } from '../appcontext';

// raycast

const Blocks = () => {
  // const [renderer, setRenderer] = React.useState<THREE.WebGLRenderer>(new THREE.WebGLRenderer());

  const appCtx = React.useContext(AppContext);
  const mount: any = React.useRef(null);
  const renderer = new THREE.WebGLRenderer();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, //fov (degree)
    window.innerWidth / window.innerHeight, //aspect ratio (螢幕比例)
    0.1, //near
    1000, //far
  );
  let raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  raycaster.setFromCamera(mouse, camera);

  let boxs = Array(appCtx.width[0])
    .fill(null)
    .map((item) =>
      Array(appCtx.width[1])
        .fill(0)
        .map((item) => Array(appCtx.width[2]).fill(0)),
    );

  const onMouseMove = (event: any) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  function handleClick(e: any) {
    e.preventDefault();

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);

    raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    boxs.forEach((item) => {
      item.forEach((item) => {
        var intersects = raycaster.intersectObjects(item);

        if (intersects.length > 0) {
          let SELECTED = intersects[0].object;
          // console.log('SELECTED: ', JSON.stringify(SELECTED));
          console.log('SELECTED: ', JSON.stringify(SELECTED.position));
          // var intersected = intersects[0].object;
          // console.log(intersects[0].object);
          return;
        }
        // });
      });
    });
  }

  let blockColor: number[] = [];
  for (const s of appCtx.blocks) {
    for (let i = 0; i < s.num; i++) {
      blockColor.push(s.colors);
    }
  }
  shuffle(blockColor);

  React.useEffect(() => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1); // 幾何
    const material = new THREE.MeshStandardMaterial({ color: 0x7e31eb }); // 材質

    let ii = 0;
    for (let i = 0; i < appCtx.width[0]; i++) {
      for (let j = 0; j < appCtx.width[1]; j++) {
        for (let k = 0; k < appCtx.width[2]; k++) {
          let material = new THREE.MeshStandardMaterial({ color: blockColor[ii] }); // 材質
          ii++;
          let cube = new THREE.Mesh(geometry, material);
          cube.position.set(i, j, k);
          // cube.position.set(
          //   i - appCtx.width[0] / 2,
          //   j - appCtx.width[1] / 2,
          //   k - appCtx.width[2] / 2,
          // );
          boxs[i][j][k] = cube;
          scene.add(cube);
        }
      }
    }

    controls.update();

    const light = new THREE.HemisphereLight(0xffffbb, 0x808080, 1); // 半圓球環境光
    scene.add(light);
    camera.position.x = 0;
    camera.position.y = 10 * Math.tan((20 * Math.PI) / 180.0);
    camera.position.z = 10;
    camera.lookAt(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      // cube.rotation.z += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return <div ref={mount} onClick={handleClick} onMouseMove={onMouseMove} onMouseOut={() => {}} />;
};

export default Blocks;

// Fisher-Yates ...
function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
