function createReferenceAxes() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
	camera.position.set(1, 1, 5);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	const renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setClearColor(0xffffff, 1);
	renderer.setSize(900, 700);
	document.getElementById("graphDiv").appendChild(renderer.domElement);

	// Criar os objetos para cada eixo
	const xAxis = new THREE.Object3D();
	const yAxis = new THREE.Object3D();
	const zAxis = new THREE.Object3D();

	// Adicionar os objetos dos eixos à cena
	scene.add(zAxis); // Z-Axis antes do X-Axis
	scene.add(yAxis);
	scene.add(xAxis); // X-Axis depois do Z-Axis

	const xAxisHelper = new THREE.AxesHelper(1); // Comprimento do eixo x
	const yAxisHelper = new THREE.AxesHelper(1); // Comprimento do eixo y
	const zAxisHelper = new THREE.AxesHelper(1); // Comprimento do eixo z

	xAxisHelper.material.depthTest = false;
	xAxisHelper.material.transparent = true;
	xAxisHelper.material.opacity = 1;
	xAxisHelper.material.color.set(0x000000); // Definir a cor dos eixos como preto
	xAxis.add(xAxisHelper);

	yAxisHelper.material.depthTest = false;
	yAxisHelper.material.transparent = true;
	yAxisHelper.material.opacity = 1;
	yAxisHelper.material.color.set(0x000000); // Definir a cor dos eixos como preto
	yAxis.add(yAxisHelper);

	zAxisHelper.material.depthTest = false;
	zAxisHelper.material.transparent = true;
	zAxisHelper.material.opacity = 1;
	zAxisHelper.material.color.set(0x000000); // Definir a cor dos eixos como preto
	zAxis.add(zAxisHelper);

	// Alterar comprimento do eixo x
	xAxisHelper.scale.set(2, 1, 1); // Aumenta o comprimento do eixo x em 2 vezes

	// Alterar comprimento do eixo y
	yAxisHelper.scale.set(1, 2, 1); // Reduz o comprimento do eixo y pela metade

	// Alterar comprimento do eixo z
	zAxisHelper.scale.set(1, 1, 3.1); // Aumenta o comprimento do eixo z em 3 vezes


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

		const xTextGeometry = new THREE.TextGeometry("x", {
			font: font,
			size: 0.08,
			height: 0.02,
		});
		const xText = new THREE.Mesh(xTextGeometry, textMaterial);
		xText.position.set(0, 0, 3); // Posição do texto X alterada
		zAxis.add(xText); // Texto X adicionado ao Z-Axis

		const yTextGeometry = new THREE.TextGeometry("y", {
			font: font,
			size: 0.1,
			height: 0.02,
		});
		const yText = new THREE.Mesh(yTextGeometry, textMaterial);
		yText.position.set(2, 0, 0);
		yAxis.add(yText);

		const zTextGeometry = new THREE.TextGeometry("z", {
			font: font,
			size: 0.1,
			height: 0.02,
		});
		const zText = new THREE.Mesh(zTextGeometry, textMaterial);
		zText.position.set(0, 2, 0); // Posição do texto Z alterada
		xAxis.add(zText); // Texto Z adicionado ao X-Axis
	});

	const controls = {
		x: 0,
		y: 0,
		z: 0,
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

	function formatFraction(value) {
		if (value < 0) {
			while (value < 0) {
				value = value + Math.PI;
			}
		}

		if (value === 0) {
			return "0";
		} else if (value === Math.PI) {
			return "π";
		} else if (value === Math.PI / 2) {
			return `π/2`;
		} else if (value === Math.PI / 4) {
			return `π/4`;
		} else {
			const piFraction = value / Math.PI;
			return `${value.toFixed(2)}π`;
		}
	}

	function updatePointPosition() {
		const ro = Math.sqrt(controls.x ** 2 + controls.y ** 2 + controls.z ** 2);
		const theta = Math.atan(controls.x / controls.z); // Troquei Z por X
		const phi = Math.acos(controls.y / ro); // Troquei X por Y

		point.position.set(controls.x, controls.y, controls.z);
		sphere.scale.set(ro, ro, ro);
		line.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(controls.x, controls.y, controls.z)]);

		const roundedRo = ro.toFixed(2);
		const roundedTheta = formatFraction(theta);
		const roundedPhi = formatFraction(phi);

		document.getElementById("coordinates").innerText = `P ≡ (${roundedRo}, ${roundedTheta}, ${roundedPhi})`;

		renderer.render(scene, camera);
	}

	updatePointPosition();

	function animate() {
		requestAnimationFrame(animate);

		renderer.render(scene, camera);
	 }

	animate();
}
