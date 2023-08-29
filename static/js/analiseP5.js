// Função f(x, y)
function f(x, y, a, b, c, d, e, g) {
	return a * x ** 2 + b * y ** 2 + c * x * y + d * x + e * y + g;
}

// Número inicial de paralelepípedos
let numParallelepipeds = 10;

// Função para criar os dados para o Plotly
function createData() {
	// Obter os valores de a, b, e quantidade de curvas de nível ou valor da curva de nível do formulário
	var a = parseFloat(document.getElementById('a').value) || 0; // Valor padrão de 0 para 'a'
	var b = parseFloat(document.getElementById('b').value) || 0; // Valor padrão de 0 para 'b'
	var c = parseFloat(document.getElementById('c').value) || 0; // Valor padrão de 0 para 'c'
	var d = parseFloat(document.getElementById('d').value) || 0; // Valor padrão de 0 para 'd'
	var e = parseFloat(document.getElementById('e').value) || 0; // Valor padrão de 0 para 'e'
	var g = parseFloat(document.getElementById('g').value) || 0; // Valor padrão de 0 para 'h'

	var xi = parseFloat(document.getElementById('xi').value) || 0; // Valor padrão de 0 para 'xi'
	var xf = parseFloat(document.getElementById('xf').value) || 0; // Valor padrão de 0 para 'xf'
	var yi = parseFloat(document.getElementById('yi').value) || 0; // Valor padrão de 0 para 'yi'
	var yf = parseFloat(document.getElementById('yf').value) || 0; // Valor padrão de 0 para 'yf'

	const stepX = (xf - xi) / numParallelepipeds;
	const stepY = (yf - yi) / numParallelepipeds;

	let data = [];

	for (let i = 0; i < numParallelepipeds; i++) {
		for (let j = 0; j < numParallelepipeds; j++) {
			const x0 = xi + i * stepX;
			const y0 = yi + j * stepY;
			const x1 = x0 + stepX;
			const y1 = y0 + stepY;

			const z = f((x0 + x1) / 2, (y0 + y1) / 2, a, b, c, d, e, g);

			data.push({
				type: 'mesh3d',
				x: [x0, x1, x1, x0, x0],
				y: [y0, y0, y1, y1, y0],
				z: [0, 0, z, z, 0],	// Ajuste para representar alturas positivas ou negativas
				opacity: 0.5,
				color: 'blue',
			});
		}
	}
	return data
}

function updateGraph() {
	const plotDiv = document.getElementById('plot');

	const data = createData();

	const layout = {
		scene: {
			aspectmode: 'manual',
			aspectratio: { x: 1, y: 1, z: 1 },
		},
	};

	Plotly.newPlot(plotDiv, data, layout);
}

function onSlideChange(sliderValue) {
	numParallelepipeds = sliderValue;
	updateGraph();
}

updateGraph();
