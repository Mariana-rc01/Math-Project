function createReferenceAxes() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
	camera.position.set(0, 0, 5);

	const renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setClearColor(0xffffff, 1);
	renderer.setSize(800, 600);
	document.getElementById("graphDiv").appendChild(renderer.domElement);

	const axesHelper = new THREE.AxesHelper(2);
	axesHelper.material.depthTest = false;
	axesHelper.material.transparent = true;
	axesHelper.material.opacity = 1;
	axesHelper.material.color.set(0x000000); // Definir a cor dos eixos como preto
	scene.add(axesHelper);

	const originGeometry = new THREE.SphereGeometry(0.05);
	const originMaterial = new THREE.MeshBasicMaterial({ color: "black" });
	const origin = new THREE.Mesh(originGeometry, originMaterial);
	scene.add(origin);

	const geometry = new THREE.SphereGeometry(1, 32, 32);
	const material = new THREE.MeshBasicMaterial({ color: "lightsteelblue", wireframe: true });
	const sphere = new THREE.Mesh(geometry, material);
	scene.add(sphere);

	const lineMaterial = new THREE.LineBasicMaterial({ color: "orange" });
	const lineGeometry = new THREE.BufferGeometry().setFromPoints([
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(0, 0, 0),
	]);
	const line = new THREE.Line(lineGeometry, lineMaterial);
	scene.add(line);

	const pointMaterial = new THREE.MeshBasicMaterial({ color: "red" });
	const pointGeometry = new THREE.SphereGeometry(0.05);
	const point = new THREE.Mesh(pointGeometry, pointMaterial);
	scene.add(point);

	const fontLoader = new THREE.FontLoader();
	fontLoader.load("https://cdn.rawgit.com/mrdoob/three.js/r129/examples/fonts/helvetiker_regular.typeface.json", function (
		font
	) {
		const textMaterial = new THREE.MeshBasicMaterial({ color: "black" });

		const zTextGeometry = new THREE.TextGeometry("z", {
			font: font,
			size: 0.2,
			height: 0.02,
		});
		const zText = new THREE.Mesh(zTextGeometry, textMaterial);
		zText.position.set(0, 0, 1.2);
		scene.add(zText);

		const yTextGeometry = new THREE.TextGeometry("y", {
			font: font,
			size: 0.2,
			height: 0.02,
		});
		const yText = new THREE.Mesh(yTextGeometry, textMaterial);
		yText.position.set(1.2, 0, 0);
		scene.add(yText);

		const xTextGeometry = new THREE.TextGeometry("x", {
			font: font,
			size: 0.2,
			height: 0.02,
		});
		const xText = new THREE.Mesh(xTextGeometry, textMaterial);
		xText.position.set(0, 1.2, 0);
		scene.add(xText);
	});

	const controls = {
		theta: 0,
		phi: 0,
	};

	const thetaSlider = document.getElementById("theta");
	const thetaValue = document.getElementById("thetaValue");
	thetaSlider.addEventListener("input", () => {
		controls.theta = Number(thetaSlider.value);
		thetaValue.value = controls.theta;
		updatePointPosition();
	});

	const phiSlider = document.getElementById("phi");
	const phiValue = document.getElementById("phiValue");
	phiSlider.addEventListener("input", () => {
		controls.phi = Number(phiSlider.value);
		phiValue.value = controls.phi;
		updatePointPosition();
	});

	function updatePointPosition() {
		const theta = THREE.MathUtils.degToRad(controls.theta);
		const phi = THREE.MathUtils.degToRad(controls.phi);

		const radius = 1;

		const x = radius * Math.sin(theta) * Math.sin(phi);
		const y = radius * Math.cos(theta);
		const z = radius * Math.sin(theta) * Math.cos(phi);

		point.position.set(x, y, z);
		line.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)]);

		const roundedX = x.toFixed(2);
		const roundedY = y.toFixed(2);
		const roundedZ = z.toFixed(2);

		document.getElementById("coordinates").innerText = `P = (${roundedX}, ${roundedY}, ${roundedZ})`;

		renderer.render(scene, camera);
	}

	updatePointPosition();

	function animate() {
		requestAnimationFrame(animate);

		renderer.render(scene, camera);
	}

	animate();
}
