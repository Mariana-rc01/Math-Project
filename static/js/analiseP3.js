// Função para calcular os valores de z (f(x, y)) com base nos valores de x, y, a, b, c, d, e e g
function f(x, y, a, b, c, d, e, g) {
	return a * x**2 + b * y**2 + c * x * y + d * x + e * y + g;
}

// Função para calcular a derivada parcial de f(x,y)
function fx(x, y, a, _, c, d, _, _) {
	return 2 * a * x + c * y + d;
}

// Função para calcular a derivada parcial de f(x,y)
function fy(x, y, _, b, c, _, e, _) {
	return 2 * b * y + c * x + e;
}

// Função para calcular os valores de z para as curvas de nível
function contourLevels(x, y, a, b, c, d, e, h) {
	var Z = [];
	for (var i = 0; i < x.length; i++) {
		var row = [];
		for (var j = 0; j < y.length; j++) {
			row.push(f(x[i], y[j], a, b, c, d, e, h));
		}
		Z.push(row);
	}
	return Z;
}

// Função para criar o plano que corta o gráfico f no valor z do ponto A
function createIntersectionPlaneAtPointA(pointX, pointY, a, b, c, d, e, h) {
	var pointZ = f(pointX, pointY, a, b, c, d, e, h);

	var intersectionPlane = {
		type: 'surface',
		x: [[-5, 5], [-5, 5]],
		y: [[-5, -5], [5, 5]],
		z: [[pointZ, pointZ], [pointZ, pointZ]],
		colorscale: 'Reds',
		showscale: false,
		opacity: 0.3,
		hoverinfo: 'none',
	};

	return intersectionPlane;
}

// Função para criar os pontos no plano z=0 que têm o mesmo valor de z que o ponto A
function createPointsOnZPlane(pointX, pointY, a, b, c, d, e, h) {
	var pointZ = f(pointX, pointY, a, b, c, d, e, h);
	var points = [];

	// Intervalo de valores para x e y
	var step = 0.0005;
	for (var x = -5; x <= 5; x += step) {
		for (var y = -5; y <= 5; y += step) {
			var z = f(x, y, a, b, c, d, e, h);
			if (Math.abs(z - pointZ) < 0.001) {
				points.push([x, y, 0]);
			}
		}
	}

	return {
		type: 'scatter3d',
		mode: 'markers',
		x: points.map(point => point[1]),
		y: points.map(point => point[0]),
		z: points.map(point => point[2]),
		marker: {
			color: 'pink',
			size: 2,
		},
		showlegend: false,
	};
}

// Função para atualizar os gráficos com base nos valores de a, b, c, d, e, f e quantidade de curvas de nível ou valor da curva de nível
function updateGraph() {

		// Obter os valores de a, b, e quantidade de curvas de nível ou valor da curva de nível do formulário
		var a = parseFloat(document.getElementById('a').value) || 0; // Valor padrão de 0 para 'a'
		var b = parseFloat(document.getElementById('b').value) || 0; // Valor padrão de 0 para 'b'
		var c = parseFloat(document.getElementById('c').value) || 0; // Valor padrão de 0 para 'c'
		var d = parseFloat(document.getElementById('d').value) || 0; // Valor padrão de 0 para 'd'
		var e = parseFloat(document.getElementById('e').value) || 0; // Valor padrão de 0 para 'e'
		var h = parseFloat(document.getElementById('g').value) || 0; // Valor padrão de 0 para 'g'

		// Obter as coordenadas do ponto A
		var pointX = parseFloat(document.getElementById('point-x').value) || 0;
		var pointY = parseFloat(document.getElementById('point-y').value) || 0;

		// Calcular o valor de z para o ponto A
		var pointZ = f(pointX, pointY, a, b, c, d, e, h);

		var vector = [fx(pointX, pointY, a, b, c, d, e, h), fy(pointX, pointY, a, b, c, d, e, h)];

		// Criação do ponto A no gráfico
		var pointA = {
			type: 'scatter3d',
			mode: 'markers',
			x: [pointY],
			y: [pointX],
			z: [pointZ],
			marker: {
				color: 'pink',
				size: 6,
			},
			name:'A',
		};

		// Criação do ponto A no gráfico
		var pointA1 = {
			type: 'scatter3d',
			mode: 'markers',
			x: [pointY],
			y: [pointX],
			z: [0],
			marker: {
				color: 'magenta',
				size: 6,
			},
			name:'A\'',
		};

		// Criação do vetor para o ponto A1
		var vectorTrace = {
			type: 'scatter3d',
			mode: 'lines+markers',
			x: [pointY, pointY + vector[1]], // Coordenadas x do ponto A1 e ponto final do vetor
			y: [pointX, pointX + vector[0]], // Coordenadas y do ponto A1 e ponto final do vetor
			z: [0, 0], // Coordenadas z do plano z=0 e ponto final do vetor
			marker: {
				color: 'green', // Cor dos marcadores do vetor
				size: 3,
			},
			line: {
				color: 'green', // Cor da linha do vetor
				width: 2,
			},
			name: '∇f(A\')', // Nome da legenda do vetor
		};

		// Criação do plano de interseção no ponto A
		var intersectionPlaneAtPointA = createIntersectionPlaneAtPointA(pointX, pointY, a, b, c, d, e, h);

		// Criação dos pontos no plano z=0 que têm o mesmo valor de z que o ponto A
		var pointsOnZPlane = createPointsOnZPlane(pointX, pointY, a, b, c, d, e, h);

		// Intervalo de valores para x e y
		var x = [],
				y = [];
		for (var i = -5; i <= 5; i += 0.1) {
				x.push(i);
				y.push(i);
		}

		// Criação dos dados do gráfico 3D
		var Z_f = contourLevels(x, y, a, b, c, d, e, h);

		var data3d = [
			{
				type: 'surface',
				x: y,
				y: x,
				z: Z_f,
				colorscale: 'Viridis',
				showscale: false,
				name: 'f(x, y)',
			},
			pointA, // Adiciona o ponto A
			pointA1, // Projeção do ponto A
			intersectionPlaneAtPointA, // Adiciona o plano de interseção no ponto A
			pointsOnZPlane,
			vectorTrace,
		];

		// Definição das opções de layout dos gráficos
		var layout3d = {
				title: 'Interactive 3D Chart',
				xaxis_title: 'Y',
				yaxis_title: 'X',
				zaxis_title: 'Z',
				margin: { l: 0, r: 0, b: 0, t: 40 },
				scene: {
						camera: {
								eye: { x: 1.2, y: 1.2, z: 0.2 },
						},
						aspectmode: 'manual',
						aspectratio: {x:1, y:1, z:1}, // Ajuste conforme necessário
						domain: {
								x: [0, 1],
								y: [0, 1],
								z: [0, 0.5] // Ajuste para a posição vertical
						}
				},
		};

		// Atualização dos gráficos
		Plotly.react('plotly-graph-3d', data3d, layout3d);
}

function checkValue(input) {
	if (input.value === '') {
			input.value = 0;
		}
	updateGraph();
}

// Atualizar os gráficos inicialmente
updateGraph();

