// Função f(x, y)
function f(x, y, a, b, c, d, e, g) {
	return a * x ** 2 + b * y ** 2 + c * x * y + d * x + e * y + g;
}

// Número inicial de paralelepípedos
let numParallelepipeds = 10;

let soma = 0;

// Função para criar os dados para o Plotly
function createData() {
	var a = parseFloat(document.getElementById('a').value) || 0;
	var b = parseFloat(document.getElementById('b').value) || 0;
	var c = parseFloat(document.getElementById('c').value) || 0;
	var d = parseFloat(document.getElementById('d').value) || 0;
	var e = parseFloat(document.getElementById('e').value) || 0;
	var g = parseFloat(document.getElementById('g').value) || 0;

	var xi = parseFloat(document.getElementById('xi').value) || 0;
	var xf = parseFloat(document.getElementById('xf').value) || 0;
	var yi = parseFloat(document.getElementById('yi').value) || 0;
	var yf = parseFloat(document.getElementById('yf').value) || 0;

	const stepX = (xf - xi) / numParallelepipeds;
	const stepY = (yf - yi) / numParallelepipeds;

	let data = [];

	for (let i = 0; i < numParallelepipeds; i++) {
		for (let j = 0; j < numParallelepipeds; j++) {
			const x0 = xi + i * stepX;
			const y0 = yi + j * stepY;
			const x1 = x0 + stepX;
			const y1 = y0 + stepY;

			const zTop = f(x0,y0, a, b, c, d, e, g);
			const zBase = 0;

			const volume = zTop * Math.abs(x1 - x0) * Math.abs(y1 - y0);
			soma = soma + volume;

			const vertices = [
				[x0, y0, zTop], [x1, y0, zTop], [x1, y1, zTop], [x0, y1, zTop],
				[x0, y0, zBase], [x1, y0, zBase], [x1, y1, zBase], [x0, y1, zBase]
			];

			const faces = [
				[0, 1, 2, 3], // Top
				[2, 3, 0, 1], // Top

				[4, 5, 6, 7], // Bottom
				[6, 7, 4, 5], // Bottom

				[0, 1, 5, 4], // Side
				[5, 4, 0, 1], // Side

				[1, 2, 6, 5], // Side
				[6, 5, 1, 2], // Side

				[2, 3, 7, 6], // Side
				[7, 6, 2, 3], // Side

				[3, 0, 4, 7], // Side
				[4, 7, 3, 0] // Side
			];

			const xVertices = vertices.map(vertex => vertex[0]);
			const yVertices = vertices.map(vertex => vertex[1]);
			const zVertices = vertices.map(vertex => vertex[2]);

			data.push({
				type: 'mesh3d',
				x: xVertices,
				y: yVertices,
				z: zVertices,
				opacity: 0.5,
				color: 'blue',
				i: faces.map(face => face[0]),
				j: faces.map(face => face[1]),
				k: faces.map(face => face[2]),
			});
		}
	}
	return data;
}

function updateGraph() {
	const plotDiv = document.getElementById('plot');

	const data = createData();

	const layout = {
		margin: {
			l: 50,
			r: 50,
			b: 50,
			t: 50,
		},
		scene: {
			aspectmode: 'manual',
			aspectratio: { x: 1, y: 1, z: 1 },
			camera: {
				eye: { x: 1.2, y: 1.1, z: 0 },
			},
		},
	};

	Plotly.newPlot(plotDiv, data, layout);

	// Atualiza o valor da soma
	const somaValue = document.getElementById('soma-value');
	somaValue.textContent = soma.toFixed(2);

}

function onSlideChange() {
	numParallelepipeds = document.getElementById('level').value;
	document.getElementById('level-value').value = numParallelepipeds;
	updateGraph();
}

updateGraph();
