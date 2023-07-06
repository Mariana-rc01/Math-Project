function coordenadas_esfericas(theta_p, phi_p) {
  // Definir intervalos de theta e phi
  const theta = [];
  const phi = [];
  for (let t = 0; t < 2 * Math.PI; t += 0.1) {
    theta.push(t);
  }
  for (let p = 0; p < Math.PI; p += 0.1) {
    phi.push(p);
  }

  // Definir o raio da esfera
  const r = Math.sqrt(4);

  // Criar as coordenadas para 3D
  const coords = [];
  for (let p of phi) {
    for (let t of theta) {
      const x = r * Math.sin(p) * Math.cos(t);
      const y = r * Math.sin(p) * Math.sin(t);
      const z = r * Math.cos(p);
      coords.push({ x, y, z });
    }
  }

  // Criar a superfície da esfera
  const sphereSurface = {
    type: 'mesh3d',
    x: coords.map((coord) => coord.x),
    y: coords.map((coord) => coord.y),
    z: coords.map((coord) => coord.z),
    color: 'lightsteelblue',
    opacity: 0.5,
  };

  // Criar os fios da esfera
  const sphereWireframe = {
    type: 'scatter3d',
    mode: 'lines',
    x: coords.map((coord) => coord.x),
    y: coords.map((coord) => coord.y),
    z: coords.map((coord) => coord.z),
    line: {
      color: 'black',
      width: 0.2,
    },
  };

  // Criar o ponto P
  const point = {
    type: 'scatter3d',
    mode: 'markers',
    x: [0],
    y: [0],
    z: [0],
    marker: {
      color: 'red',
      size: 5,
    },
  };

  // Criar o layout
  const layout = {
    scene: {
      xaxis: { range: [-r, r] },
      yaxis: { range: [-r, r] },
      zaxis: { range: [-r, r] },
      aspectratio: { x: 1, y: 1, z: 1 },
      camera: {
        eye: { x: 1.25, y: 1.25, z: 1.25 },
      },
    },
    showlegend: false,
    margin: { l: 0, r: 0, t: 0, b: 0 },
  };

  let animationFrameId;

  // Função para atualizar a posição do ponto P suavemente
  function updatePointSmooth() {
    // Atualizar as coordenadas do ponto P
    const x_p = r * Math.sin(phi_p) * Math.cos(theta_p);
    const y_p = r * Math.sin(phi_p) * Math.sin(theta_p);
    const z_p = r * Math.cos(phi_p);

    // Atualizar a posição do ponto P
    point.x = [x_p];
    point.y = [y_p];
    point.z = [z_p];

    // Atualizar o texto
    const text = `P = (${x_p.toFixed(2)}, ${y_p.toFixed(2)}, ${z_p.toFixed(2)})<br>theta = ${theta_p.toFixed(2)}<br>phi = ${phi_p.toFixed(2)}`;
    document.getElementById('text').innerHTML = text;

    Plotly.redraw('graphDiv');

    // Chamar a próxima atualização de forma suave
    animationFrameId = requestAnimationFrame(updatePointSmooth);
  }

  // Função para atualizar a posição do ponto P com base nas coordenadas theta e phi
  function updatePointPosition(theta, phi) {
    theta_p = theta;
    phi_p = phi;
  }

  // Função para atualizar a posição do ponto P
  function updatePoint(eventData) {
    const { key } = eventData;

    if (key === 'ArrowUp') {
      phi_p += 0.1;
    } else if (key === 'ArrowDown') {
      phi_p -= 0.1;
    } else if (key === 'ArrowRight') {
      theta_p += 0.1;
    } else if (key === 'ArrowLeft') {
      theta_p -= 0.1;
    }

    updatePointPosition(theta_p, phi_p);
  }

  // Configurar o evento de teclado para atualizar o ponto P
  document.addEventListener('keydown', updatePoint);

  // Configurar os eventos de rato para arrastar o ponto P
  const graphDiv = document.getElementById('graphDiv');
  let isDragging = false;
  graphDiv.addEventListener('mousedown', startDrag);
  graphDiv.addEventListener('mousemove', dragPoint);
  graphDiv.addEventListener('mouseup', stopDrag);
  graphDiv.addEventListener('mouseleave', stopDrag);

  let startX, startY;

  function startDrag(event) {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
  }

  function dragPoint(event) {
    if (isDragging) {
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      const sensitivity = 0.01;
      theta_p += sensitivity * deltaX;
      phi_p -= sensitivity * deltaY;

      startX = event.clientX;
      startY = event.clientY;
    }
  }

  function stopDrag() {
    isDragging = false;
  }

  // Criar a figura
  const data = [sphereSurface, sphereWireframe, point];
  Plotly.newPlot('graphDiv', data, layout);

  // Iniciar a atualização suave do ponto P
  updatePointSmooth();

  // Atualizar a posição inicial do ponto P
  updatePointPosition(theta_p, phi_p);
}
