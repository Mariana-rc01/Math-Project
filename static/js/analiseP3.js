// Função para calcular os valores de z (f(x, y)) com base nos valores de x, y, a, b, c, d, e e g
function f(x, y, a, b, c, d, e, g) {
	return a * x**2 + b * y**2 + c * x * y + d * x + e * y + g;
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

		// Criação do ponto A no gráfico
		var pointA = {
			type: 'scatter3d',
			mode: 'markers',
			x: [pointY],
			y: [pointX],
			z: [pointZ],
			marker: {
					color: 'red',
					size: 4,
			},
		};

		// Criação do plano da curva de nível
		var contourPlane = {
			type: 'surface',
			x: y,
			y: x,
			z: Z_f,
			colorscale: 'Reds',
			showscale: false,
			opacity: 0.5, // Ajuste a opacidade conforme necessário
		};

		// Encontrar o contorno da curva de nível no ponto A
		var contourLevelsAtPointA = contourLevels([pointX], [pointY], a, b, c, d, e, h);

		// Extrair o contorno da curva de nível
		var contourLine = {
				type: 'scatter3d',
				mode: 'lines',
				x: contourLevelsAtPointA[0], // Valores x do contorno da curva
				y: contourLevelsAtPointA[1], // Valores y do contorno da curva
				z: contourLevelsAtPointA[0], // Valores z do contorno da curva
				line: { color: 'blue', width: 2 },
		};

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
				contourPlane, // Adicione o plano da curva de nível
				pointA, // Adicione o ponto A
				contourLine, // Adicione a linha curva paralela ao plano z=0
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

