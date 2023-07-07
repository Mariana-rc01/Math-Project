function coordenadas_esfericas(theta_p, phi_p) {
	// Define theta and phi ranges
	const theta = [];
	const phi = [];
	for (let t = 0; t < 2 * Math.PI; t += 0.1) {
		theta.push(t);
	}
	for (let p = 0; p < Math.PI; p += 0.1) {
		phi.push(p);
	}

	// Set the radius of the sphere
	const r = Math.sqrt(4);

	// Create the coordinates for 3D
	const coords = [];
	for (let p of phi) {
		for (let t of theta) {
			const x = r * Math.sin(p) * Math.cos(t);
			const y = r * Math.sin(p) * Math.sin(t);
			const z = r * Math.cos(p);
			coords.push({ x, y, z });
		}
	}

	// Create the surface of the sphere
	const sphereSurface = {
		type: 'mesh3d',
		x: coords.map((coord) => coord.x),
		y: coords.map((coord) => coord.y),
		z: coords.map((coord) => coord.z),
		color: 'lightsteelblue',
		opacity: 0.5,
	};

	// Create the Sphere Wires
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

	// Create the P-point
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

	// Create the layout
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

	// Function to update the P-point position smoothly
	function updatePointSmooth() {
		// Update P point coordinates
		const x_p = r * Math.sin(phi_p) * Math.cos(theta_p);
		const y_p = r * Math.sin(phi_p) * Math.sin(theta_p);
		const z_p = r * Math.cos(phi_p);

		// Update the position of the P point
		point.x = [x_p];
		point.y = [y_p];
		point.z = [z_p];

		// Update the text
		const text = `P = (${x_p.toFixed(2)}, ${y_p.toFixed(2)}, ${z_p.toFixed(2)})<br>theta = ${theta_p.toFixed(2)}<br>phi = ${phi_p.toFixed(2)}`;
		document.getElementById('text').innerHTML = text;

		Plotly.redraw('graphDiv');

		// Call the next update smoothly
		animationFrameId = requestAnimationFrame(updatePointSmooth);
	}

	// Function to update the position of the P point based on theta and phi coordinates
	function updatePointPosition(theta, phi) {
		theta_p = theta;
		phi_p = phi;
	}

	// Function to update the position of the P point
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

		// Check limits of theta_p and phi_p
		if (theta_p < 0) {
			theta_p += 2 * Math.PI;
		} else if (theta_p >= 2 * Math.PI) {
			theta_p -= 2 * Math.PI;
		}
		if (phi_p < 0) {
			phi_p += 2 * Math.PI;
		} else if (phi_p >= 2 * Math.PI) {
			phi_p -= 2 * Math.PI;
		}

		updatePointPosition(theta_p, phi_p);
	}

	// Configure keyboard event to update point P
	document.addEventListener('keydown', updatePoint);

	// Configure mouse events for dragging the P point
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

	// Create the figure
	const data = [sphereSurface, sphereWireframe, point];
	Plotly.newPlot('graphDiv', data, layout);

	// Start P-point soft update
	updatePointSmooth();

	// Update the starting position of the P point
	updatePointPosition(theta_p, phi_p);
}
