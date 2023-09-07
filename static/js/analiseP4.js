//Developed by Mariana Rocha (https://github.com/Mariana-rc01)

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

// Função para encontrar a interseção dos pontos com z = 0
function createPointsOnZPlane(a, b, c, d, e, h) {
	var points = [];

	// Intervalo de valores para x e y
	var step = 0.0005;
	for (var x = -5; x <= 5; x += step) {
		for (var y = -5; y <= 5; y += step) {
			var z = f(x, y, a, b, c, d, e, h);
			if (Math.abs(z) < 0.001) {
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

// Declare a variável data3d fora do evento de clique Plotly
var data3d = [];
var layout3d;

// Declare as variáveis clickedX e clickedY fora da função updateGraph
var clickedX, clickedY;

// Adicione um evento de clique ao gráfico Plotly
var plotlyGraph = document.getElementById('plotly-graph-3d');
Plotly.newPlot(plotlyGraph, data3d, layout3d);

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

	var x = [],
			y = [];
	for (var i = -5; i <= 5; i += 0.1) {
		x.push(i);
		y.push(i);
	}

	var Z_f = contourLevels(x, y, a, b, c, d, e, h);
	var pointsOnZPlane = createPointsOnZPlane(i, j, k, l, m, n);

	data3d = [
		{
			type: 'surface',
			x: y,
			y: x,
			z: Z_f,
			colorscale: 'Viridis',
			showscale: false,
			opacity: 0.5,
			name: 'f(x, y)',
		},
		pointsOnZPlane,
	];

	// Definição das opções de layout dos gráficos
	layout3d = {
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
				aspectratio: {x:1, y:1, z:1},
				domain: {
						x: [0, 1],
						y: [0, 1],
						z: [0, 0.5]
				}
		},
	};

	// Atualização dos gráficos
	Plotly.react('plotly-graph-3d', data3d, layout3d);
}

// Função para adicionar novos traços ao gráfico
function addNewTraces(newTraces) {
	// Combine os traços existentes com os novos traços
	data3d = data3d.concat(newTraces);
	// Coloque o código que está causando o erro aqui
	Plotly.newPlot('plotly-graph-3d', data3d, layout3d);
}

// Declare a variável plotlyData para armazenar os elementos adicionados ao gráfico
var plotlyData = [];

// Adicione um evento de clique ao gráfico Plotly
plotlyGraph.on('plotly_click', function(data) {
	if (data.points.length > 0) {
		var clickedPoint = data.points[0];
		if (clickedPoint && clickedPoint.x !== undefined && clickedPoint.y !== undefined) {
			clickedX = parseFloat(clickedPoint.y.toFixed(4)); // Coordenada x do ponto clicado
			clickedY = parseFloat(clickedPoint.x.toFixed(4)); // Coordenada y do ponto clicado

			console.log('Coordenadas do ponto clicado - X: ' + clickedX + ', Y: ' + clickedY);

			// Verifique se o ponto já existe no array
			var pointAlreadyExists = false;
			for (var i = 0; i < plotlyData.length; i++) {
				if (plotlyData[i].type === 'scatter3d' && plotlyData[i].name === 'P') {
					var existingX = plotlyData[i].y[0];
					var existingY = plotlyData[i].x[0];
					if (existingX === clickedX && existingY === clickedY) {
						pointAlreadyExists = true;
						break;
					}
				}
			}

			if (!pointAlreadyExists) {
				clearTraces();
			// Adicione os novos elementos ao gráfico
			addPointAndVectors(clickedX, clickedY);
			}
		}
	}
});

// Função para limpar os traços existentes
function clearTraces() {
	data3d = data3d.filter(trace => trace.name !== 'P' && trace.name !== 'f(P)' && trace.name !== '∇f(P)' && trace.name !== '∇g(P)');
	Plotly.newPlot('plotly-graph-3d', data3d, layout3d);
}

function addPointAndVectors(pointX, pointY) {
	// Obtenha os valores de a, b, c, d, e, h, i, j, k, l, m e n
	var a = parseFloat(document.getElementById('a').value) || 0;
	var b = parseFloat(document.getElementById('b').value) || 0;
	var c = parseFloat(document.getElementById('c').value) || 0;
	var d = parseFloat(document.getElementById('d').value) || 0;
	var e = parseFloat(document.getElementById('e').value) || 0;
	var h = parseFloat(document.getElementById('h').value) || 0;

	var i = parseFloat(document.getElementById('i').value) || 0;
	var j = parseFloat(document.getElementById('j').value) || 0;
	var k = parseFloat(document.getElementById('k').value) || 0;
	var l = parseFloat(document.getElementById('l').value) || 0;
	var m = parseFloat(document.getElementById('m').value) || 0;
	var n = parseFloat(document.getElementById('n').value) || 0;

	var pointZ = f(pointX, pointY, a, b, c, d, e, h);

	console.log('Coordenadas do ponto clicado - X: ' + pointX + ', Y: ' + pointY + pointZ);

	// Crie os novos elementos do gráfico
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
		name: 'P',
	};

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
		name: 'f(P)',
	};

	var vectorf = [dx(pointX, pointY, a, b, c, d, e, h), dy(pointX, pointY, a, b, c, d, e, h)];
	var vectorg = [dx(pointX, pointY, i, j, k, l, m, n), dy(pointX, pointY, i, j, k, l, m, n)];

	var vectorTracef = {
		type: 'scatter3d',
		mode: 'lines+markers',
		x: [pointY, pointY + vectorf[1]],
		y: [pointX, pointX + vectorf[0]],
		z: [0, 0],
		marker: {
			color: 'green',
			size: 3,
		},
		line: {
			color: 'green',
			width: 2,
		},
		name: '∇f(P)',
	};

	var vectorTraceg = {
		type: 'scatter3d',
		mode: 'lines+markers',
		x: [pointY, pointY + vectorg[1]],
		y: [pointX, pointX + vectorg[0]],
		z: [0, 0],
		marker: {
			color: 'orange',
			size: 3,
		},
		line: {
			color: 'orange',
			width: 2,
		},
		name: '∇g(P)',
	};

	// Crie os novos elementos do gráfico
	var newTraces = [pointP, pointfP, vectorTracef, vectorTraceg];

	addNewTraces(newTraces);
}

function checkValue(input) {
	if (input.value === '') {
			input.value = 0;
		}
	updateGraph();
}

// Ouvinte de evento para o botão de redefinição
document.getElementById('resetButton').addEventListener('click', function() {
	// Carrega novamente o arquivo JavaScript
	var scriptElement = document.createElement('script');
	scriptElement.src = 'static/js/analiseP4.js';

	// Remove o script anterior (opcional)
	var oldScript = document.querySelector('script[src="static/js/analiseP4.js"]');
	if (oldScript) {
			oldScript.remove();
	}

	// Adiciona o novo script ao corpo da página
	document.body.appendChild(scriptElement);
});


// Atualizar os gráficos inicialmente
updateGraph();

