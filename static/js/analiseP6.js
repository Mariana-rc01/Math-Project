//Developed by Mariana Rocha (https://github.com/Mariana-rc01)

function createReferenceAxes() {
	// Set up the scene, camera, and renderer
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
	camera.position.set(1, 1, 5);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	const renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setClearColor(0xffffff, 1);
	renderer.setSize(900, 700);
	document.getElementById("graphDiv").appendChild(renderer.domElement);

	// Create objects for each axis
	const xAxis = new THREE.Object3D();
	const yAxis = new THREE.Object3D();
	const zAxis = new THREE.Object3D();

	// Add axis objects to the scene
	scene.add(zAxis); // Z-Axis before X-Axis
	scene.add(yAxis);
	scene.add(xAxis); // X-Axis after Z-Axis

	// Create axis helpers
	const xAxisHelper = new THREE.AxesHelper(1);
	const yAxisHelper = new THREE.AxesHelper(1);
	const zAxisHelper = new THREE.AxesHelper(1);

	xAxisHelper.material.depthTest = false;
	xAxisHelper.material.transparent = true;
	xAxisHelper.material.opacity = 1;
	xAxisHelper.material.color.set(0x000000);
	xAxis.add(xAxisHelper);

	yAxisHelper.material.depthTest = false;
	yAxisHelper.material.transparent = true;
	yAxisHelper.material.opacity = 1;
	yAxisHelper.material.color.set(0x000000);
	yAxis.add(yAxisHelper);

	zAxisHelper.material.depthTest = false;
	zAxisHelper.material.transparent = true;
	zAxisHelper.material.opacity = 1;
	zAxisHelper.material.color.set(0x000000);
	zAxis.add(zAxisHelper);

	xAxisHelper.scale.set(2, 1, 1);

	yAxisHelper.scale.set(1, 2, 1);

	zAxisHelper.scale.set(1, 1, 3.1);

	const originGeometry = new THREE.SphereGeometry(0.05);
	const originMaterial = new THREE.MeshBasicMaterial({ color: "black" });
	const origin = new THREE.Mesh(originGeometry, originMaterial);
	scene.add(origin);

	const geometry = new THREE.SphereGeometry(1, 32, 32);
	const material = new THREE.MeshBasicMaterial({ color: "lightsteelblue", wireframe: true });
	const sphere = new THREE.Mesh(geometry, material);
	scene.add(sphere);

	const lineMaterial = new THREE.LineBasicMaterial({ color: "darkblue" });
	const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]);
	const line = new THREE.Line(lineGeometry, lineMaterial);
	scene.add(line);

	const pointMaterial = new THREE.MeshBasicMaterial({ color: "red" });
	const pointGeometry = new THREE.SphereGeometry(0.05);
	const point = new THREE.Mesh(pointGeometry, pointMaterial);
	scene.add(point);

	const fontLoader = new THREE.FontLoader();
	fontLoader.load("https://cdn.rawgit.com/mrdoob/three.js/r129/examples/fonts/helvetiker_regular.typeface.json", function (font) {
		const textMaterial = new THREE.MeshBasicMaterial({ color: "black" });

		const xTextGeometry = new THREE.TextGeometry("X", {
			font: font,
			size: 0.08,
			height: 0.02,
		});
		const xText = new THREE.Mesh(xTextGeometry, textMaterial);
		xText.position.set(0, 0, 3);
		zAxis.add(xText);

		const yTextGeometry = new THREE.TextGeometry("Y", {
			font: font,
			size: 0.1,
			height: 0.02,
		});
		const yText = new THREE.Mesh(yTextGeometry, textMaterial);
		yText.position.set(2, 0, 0);
		yAxis.add(yText);

		const zTextGeometry = new THREE.TextGeometry("Z", {
			font: font,
			size: 0.1,
			height: 0.02,
		});
		const zText = new THREE.Mesh(zTextGeometry, textMaterial);
		zText.position.set(0, 2, 0);
		xAxis.add(zText);
	});

	const controls = {
		x: 1,
		y: 1,
		z: 1,
	};

	const xSlider = document.getElementById("x");
	const xValue = document.getElementById("xValue");
	xSlider.addEventListener("input", () => {
		controls.y = Number(xSlider.value);
		xValue.value = controls.y;
		updatePointPosition();
	});

	const ySlider = document.getElementById("y");
	const yValue = document.getElementById("yValue");
	ySlider.addEventListener("input", () => {
		controls.z = Number(ySlider.value);
		yValue.value = controls.z;
		updatePointPosition();
	});

	const zSlider = document.getElementById("z");
	const zValue = document.getElementById("zValue");
	zSlider.addEventListener("input", () => {
		controls.x = Number(zSlider.value);
		zValue.value = controls.x;
		updatePointPosition();
	});

	xValue.addEventListener("input", () => {
		controls.y = Number(xValue.value);
		xSlider.value = controls.y;
		updatePointPosition();
	});

	yValue.addEventListener("input", () => {
		controls.z = Number(yValue.value);
		ySlider.value = controls.z;
		updatePointPosition();
	});

	zValue.addEventListener("input", () => {
		controls.x = Number(zValue.value);
		zSlider.value = controls.x;
		updatePointPosition();
	});

	const thetaLineMaterial = new THREE.LineBasicMaterial({ color: "darkblue"});
	const thetaLineGeometry = new THREE.BufferGeometry().setFromPoints([
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(controls.x, 0, controls.z),
	]);
	thetaLine = new THREE.Line(thetaLineGeometry, thetaLineMaterial);
	scene.add(thetaLine);

	const thetaCurveMaterial = new THREE.LineBasicMaterial({ color: "green" });
	const thetaCurveGeometry = new THREE.BufferGeometry();
	const thetaCurvePoints = [];
	const thetaCurve = new THREE.Line(thetaCurveGeometry, thetaCurveMaterial);
	scene.add(thetaCurve);

	// Phi

	const phiCurveMaterial = new THREE.LineBasicMaterial({ color: "red" });
	const phiCurveGeometry = new THREE.BufferGeometry();
	const phiCurvePoints = [];
	const phiCurve = new THREE.Line(phiCurveGeometry, phiCurveMaterial);
	scene.add(phiCurve);

	function formatFraction(value) {
		const piFraction = (value / Math.PI).toFixed(2);

		if (piFraction === "0.00") {
			return "0";
		} else if (piFraction === "1.00") {
				return `<img src="static/images/problems/pi.png" alt="pi" style="display: inline-block; vertical-align: middle;>`;
		} else if (piFraction === "0.50") {
				return `<img src="static/images/problems/pi.png" alt="pi" style="display: inline-block; vertical-align: middle;">/2`;
		} else if (piFraction === "0.25") {
				return `<img src="static/images/problems/pi.png" alt="pi" style="display: inline-block; vertical-align: middle;">/4`;
		} else {
				return `${piFraction}<img src="static/images/problems/pi.png" alt="pi" style="display: inline-block; vertical-align: middle;">`;
		}
	}

	function updatePointPosition() {
		const ro = Math.sqrt(controls.x ** 2 + controls.y ** 2 + controls.z ** 2);
		theta = 0;
		const value = Math.sqrt(controls.z ** 2 + controls.x ** 2);
		if (controls.z === 0 && controls.x === 0) {
			theta = 0;
		}
		else if (controls.x >= 0) {
			theta = Math.acos(controls.z / value);
		}
		else {
			theta = 2 * Math.PI - Math.acos(controls.z / value);
			// Swap X and Z, and Y and X
		}
		phi = 0;
		if (controls.y === 0 && controls.x === 0 && controls.z === 0) {
			phi = 0;
		}
		else {
			phi = Math.acos(controls.y / ro); // Swap Z by Y
		}

		const maxRadius = 1.8;
		const scaleFactor = Math.min(1, maxRadius / ro);

		const xScaled = controls.x * scaleFactor;
		const yScaled = controls.y * scaleFactor;
		const zScaled = controls.z * scaleFactor;

		point.position.set(xScaled, yScaled, zScaled);
		sphere.scale.set(ro <= maxRadius ? ro : maxRadius, ro <= maxRadius ? ro : maxRadius, ro <= maxRadius ? ro : maxRadius);
		line.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(xScaled, yScaled, zScaled)]);

		const roundedRo = ro.toFixed(2);
		const roundedTheta = formatFraction(theta);
		const roundedPhi = formatFraction(phi);

		// Update geometry of theta lines
		thetaLine.geometry.setFromPoints([
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(xScaled, 0, zScaled),
		]);

		// Update position of theta curve line
		thetaCurvePoints.length = 0;
		thetaCurvePoints.push(new THREE.Vector3(0, 0, 0));
		const escala = Math.sqrt(zScaled ** 2 + xScaled ** 2);
		for (let angle = 0; angle <= theta; angle += 0.01) {
			const x = Math.cos(angle) * escala;
			const z = Math.sin(angle) * escala;
			thetaCurvePoints.push(new THREE.Vector3(z, 0, x));
		}
		thetaCurve.geometry.setFromPoints(thetaCurvePoints);

		// Phi curve
		phiCurvePoints.length = 0;

		const p0 = new THREE.Vector3(xScaled, yScaled, zScaled); // Point P
		const poleN = new THREE.Vector3(0, ro <= maxRadius ? ro : maxRadius, 0);

		const segments = 100; // Number of segments for the curve

		for (let i = 0; i <= segments; i++) {
			const t = i / segments;
			const point = getPointOnSphereCurve(p0, poleN, t);
			phiCurvePoints.push(point);
		}

		phiCurve.geometry.setFromPoints(phiCurvePoints);

		function getPointOnSphereCurve(p0, pole, t) {
			const sphereNormal = p0.clone().normalize();
			const poleNormal = pole.clone().normalize();

			const rotationAxis = new THREE.Vector3().crossVectors(sphereNormal, poleNormal).normalize();
			const rotationAngle = Math.acos(sphereNormal.dot(poleNormal));

			const q = new THREE.Quaternion().setFromAxisAngle(rotationAxis, rotationAngle * t);
			const pointOnSphere = sphereNormal.clone().applyQuaternion(q).multiplyScalar(ro <= maxRadius ? ro : maxRadius);

			return pointOnSphere;
		}

var coordinatesSpan = document.getElementById("coordinates");

// Update content within the #coordinates element
coordinatesSpan.innerHTML = ` (${roundedRo}, ${roundedTheta}, ${roundedPhi})`;
		renderer.render(scene, camera);
	}

	updatePointPosition();

	function animate() {
		requestAnimationFrame(animate);

		renderer.render(scene, camera);
	 }

	animate();
}
