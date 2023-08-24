// Função para calcular os valores de z (f(x, y)) com base nos valores de x, y, a, b, c, d, e e h
function f(x, y, a, b, c, d, e, h) {
	return a * x**2 + b * y**2 + c * x * y + d * x + e * y + h;
}

// Função para calcular a derivada parcial de f(x,y)
function dx(x, y, a, _, c, d, _, _) {
	return 2 * a * x + c * y + d;
}

// Função para calcular a derivada parcial de f(x,y)
function dy(x, y, _, b, c, _, e, _) {
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

// Calcula os pontos de interseção entre a superfície g(x, y) e o plano z = 0
function calculateIntersectionPoints(Z_g) {
	var intersectionPoints = [];

	for (var i = 0; i < Z_g.length; i++) {
			for (var j = 0; j < Z_g[i].length; j++) {
					if (Z_g[i][j] === 0) {
							intersectionPoints.push({ x: y[j], y: x[i], z: 0 });
					}
			}
	}
	return intersectionPoints;
}

// Função para atualizar os gráficos com base nos valores de a, b, c, d, e, f e quantidade de curvas de nível ou valor da curva de nível
function updateGraph() {

		// Obter os valores de a, b, e quantidade de curvas de nível ou valor da curva de nível do formulário
		var a = parseFloat(document.getElementById('a').value) || 0; // Valor padrão de 0 para 'a'
		var b = parseFloat(document.getElementById('b').value) || 0; // Valor padrão de 0 para 'b'
		var c = parseFloat(document.getElementById('c').value) || 0; // Valor padrão de 0 para 'c'
		var d = parseFloat(document.getElementById('d').value) || 0; // Valor padrão de 0 para 'd'
		var e = parseFloat(document.getElementById('e').value) || 0; // Valor padrão de 0 para 'e'
		var h = parseFloat(document.getElementById('h').value) || 0; // Valor padrão de 0 para 'h'

		var i = parseFloat(document.getElementById('i').value) || 0; // Valor padrão de 0 para 'i'
		var j = parseFloat(document.getElementById('j').value) || 0; // Valor padrão de 0 para 'j'
		var k = parseFloat(document.getElementById('k').value) || 0; // Valor padrão de 0 para 'k'
		var l = parseFloat(document.getElementById('l').value) || 0; // Valor padrão de 0 para 'l'
		var m = parseFloat(document.getElementById('m').value) || 0; // Valor padrão de 0 para 'm'
		var n = parseFloat(document.getElementById('n').value) || 0; // Valor padrão de 0 para 'n'

		// Obter as coordenadas do ponto P
		var pointX = parseFloat(document.getElementById('point-x').value) || 0;
		var pointY = parseFloat(document.getElementById('point-y').value) || 0;

		// Calcular o valor de z para o ponto P
		var pointZ = f(pointX, pointY, a, b, c, d, e, h);

		var vectorf = [dx(pointX, pointY, a, b, c, d, e, h), dy(pointX, pointY, a, b, c, d, e, h)];
		var vectorg = [dx(pointX, pointY, i, j, k, l, m, n), dy(pointX, pointY, i, j, k, l, m, n)];

		// Intervalo de valores para x e y
		var x = [],
				y = [];
		for (var i = -5; i <= 5; i += 0.1) {
				x.push(i);
				y.push(i);
		}

		// Criação dos dados do gráfico 3D
		var Z_f = contourLevels(x, y, a, b, c, d, e, h);
		var Z_g = contourLevels(x, y, i, j, k, l, m, n); // Calcula os valores de g(x, y)
		var intersectionPoints = calculateIntersectionPoints(Z_g); // Calcula os pontos de interseção

		// Criação do ponto A no gráfico
		var pointfP = {
			type: 'scatter3d',
			mode: 'markers',
			x: [pointY],
			y: [pointX],
			z: [pointZ],
			marker: {
				color: 'pink',
				size: 6,
			},
			name:'f(P)',
		};

		// Criação do ponto A no gráfico
		var pointP = {
			type: 'scatter3d',
			mode: 'markers',
			x: [pointY],
			y: [pointX],
			z: [0],
			marker: {
				color: 'magenta',
				size: 6,
			},
			name:'P',
		};

		// Criação do vetor para o ponto A1
		var vectorTracef = {
			type: 'scatter3d',
			mode: 'lines+markers',
			x: [pointY, pointY + vectorf[1]], // Coordenadas x do ponto A1 e ponto final do vetor
			y: [pointX, pointX + vectorf[0]], // Coordenadas y do ponto A1 e ponto final do vetor
			z: [0, 0], // Coordenadas z do plano z=0 e ponto final do vetor
			marker: {
				color: 'green', // Cor dos marcadores do vetor
				size: 3,
			},
			line: {
				color: 'green', // Cor da linha do vetor
				width: 2,
			},
			name: '∇f(P)', // Nome da legenda do vetor
		};

		// Criação do vetor para o ponto A1
		var vectorTraceg = {
			type: 'scatter3d',
			mode: 'lines+markers',
			x: [pointY, pointY + vectorg[1]], // Coordenadas x do ponto A1 e ponto final do vetor
			y: [pointX, pointX + vectorg[0]], // Coordenadas y do ponto A1 e ponto final do vetor
			z: [0, 0], // Coordenadas z do plano z=0 e ponto final do vetor
			marker: {
				color: 'orange', // Cor dos marcadores do vetor
				size: 3,
			},
			line: {
				color: 'orange', // Cor da linha do vetor
				width: 2,
			},
			name: '∇g(P)', // Nome da legenda do vetor
		};

		var data3d = [
			{
					type: 'scatter3d',
					mode: 'markers',
					x: intersectionPoints.map(point => point.x),
					y: intersectionPoints.map(point => point.y),
					z: intersectionPoints.map(point => point.z),
					marker: {
							size: 4,
							color: 'red',
					},
					name: 'Interseção',
			},
			{
					type: 'surface',
					x: y,
					y: x,
					z: Z_f,
					colorscale: 'Viridis', // Escolha uma escala de cores adequada
					showscale: false,
					opacity: 0.5,
					name: 'f(x, y)',
			},
			pointP,
			pointfP,
			vectorTracef,
			vectorTraceg,
		];

		// Definição das opções de layout dos gráficos
		var layout3d = {
				title: 'Gráfico 3D Interativo',
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

