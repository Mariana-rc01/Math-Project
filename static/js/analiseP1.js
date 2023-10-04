//Developed by Mariana Rocha (https://github.com/Mariana-rc01)

// Função para calcular os valores de z (f(x, y)) com base nos valores de x, y, a, b, c, d, e e f
function g(x, y, a, b, c, d, e, f) {
	return a * x**2 + b * y**2 + c * x * y + d * x + e * y + f;
}

// Função para calcular as curvas de nível com base nos valores de x, y, a, b, c, d, e e f
function contourLevels(x, y, a, b, c, d, e, f) {
		var Z = [];
		for (var i = 0; i < x.length; i++) {
				var z_row = [];
				for (var j = 0; j < y.length; j++) {
						z_row.push(g(x[i], y[j], a, b, c, d, e, f));
				}
				Z.push(z_row);
		}
		return Z;
}

// Função para criar o plano de curvas de nível no primeiro gráfico 3D
function createContourPlane(x, y, a, b, c, d, e, f, level) {
		var Z = contourLevels(x, y, a, b, c, d, e, f);
		var Z_masked = Z.map((row) => row.map((val) => (val >= level ? level : NaN)));

		return {
				type: 'surface',
				x: y,
				y: x,
				z: Z_masked,
				colorscale: 'Reds',
				showscale: false,
				opacity: 0.3,
				hoverinfo: 'none',
		};
}

// Função para criar os cortes horizontais nas posições das curvas de nível no gráfico 2D
function createCuts(x, y, a, b, c_values, c, d, e, f) {
		var cuts = [];
		var Z = contourLevels(x, y, a, b, c, d, e, f);
		for (var level of c_values) {
				var trace = {
						type: 'scatter',
						mode: 'lines',
						x: y,
						y: Z.map((row) => row.map((val) => (val >= level ? level : NaN))),
						line: { color: 'black' },
						legendgroup: 'curves',
						showlegend: false,
				};
				cuts.push(trace);
		}
		return cuts;
}

// Função para criar o corte único no gráfico 2D
function createSingleCut(x, y, a, b, c, d, e, f, level) {
	var Z = contourLevels(x, y, a, b, c, d, e, f);
	var trace = {
		type: 'scatter',
		mode: 'lines',
		x: y,
		y: Z.map((row) => row.map((val) => (val >= level ? level : NaN))),
		line: { color: 'black' },
		legendgroup: 'curves',
		showlegend: false,
	};
	return trace;
}

// Função para atualizar os gráficos com base nos valores de a, b, c, d, e, f e quantidade de curvas de nível ou valor da curva de nível
function updateGraph() {
		// Check the selected option (apenas uma curva or muitas curvas)
		var singleCurveOption = document.getElementById('single-curve');
		var isSingleCurveOption = singleCurveOption.checked;

		// Obter os valores de a, b, e quantidade de curvas de nível ou valor da curva de nível do formulário
		var a = parseFloat(document.getElementById('a').value) || 0; // Valor padrão de 1 para 'a'
		var b = parseFloat(document.getElementById('b').value) || 0; // Valor padrão de 1 para 'b'
		var c = parseFloat(document.getElementById('c').value) || 0; // Valor padrão de 0 para 'c'
		var d = parseFloat(document.getElementById('d').value) || 0; // Valor padrão de 0 para 'd'
		var e = parseFloat(document.getElementById('e').value) || 0; // Valor padrão de 0 para 'e'
		var f = parseFloat(document.getElementById('f').value) || 0; // Valor padrão de 0 para 'f'
		var curves = parseInt(document.getElementById('curves-value').value); // Valor padrão de 1 para quantidade de curvas de nível se a caixa estiver vazia
		var level = parseFloat(document.getElementById('level-value').value); // Valor da curva de nível para a opção de uma curva

		// Atualizar o valor da quantidade de curvas de nível ou valor da curva de nível na barra de deslizar
		document.getElementById('curves').value = curves;
		document.getElementById('level').value = level;

		// Intervalo de valores para x e y
		var x = [],
				y = [];
		for (var i = -5; i <= 5; i += 0.1) {
				x.push(i);
				y.push(i);
		}

		// c values for contour lines
		var c_values = [];
		var Z = contourLevels(x, y, a, b, c, d, e, f);
		var minZ = Math.min(...Z.flat());
		var maxZ = Math.max(...Z.flat());

		if (isSingleCurveOption) {
				// For the single curve option, use the level value to update the contour plane
				c_values.push(level);

		} else {
				// For the many curves option, generate c_values based on the number of curves
				for (var k = 0; k < curves; k++) {
					var level = minZ + (k / curves) * (maxZ - minZ);
					c_values.push(level);
				}
		}

		// Criação dos planos de curvas de nível
		var planes = [];
		for (var level of c_values) {
				planes.push(createContourPlane(x, y, a, b, c, d, e, f, level));
		}

		// Criação dos dados do gráfico 3D
		var data3d = [
				{
						type: 'surface',
						x: y,
						y: x,
						z: contourLevels(x, y, a, b, c, d, e, f),
						colorscale: 'Viridis',
						showscale: false, // Disable colorscale
				},
		].concat(planes);

		// Definição das opções de layout dos gráficos
		var layout3d = {
				title: '3D Interactive Plot',
				xaxis_title: 'Y',
				yaxis_title: 'X',
				zaxis_title: 'Z',
				margin: { l: 0, r: 0, b: 0, t: 40 },
				scene: {
						camera: {
								eye: { x: 1.2, y: 1.2, z: 0.7 },
						},
				},
		};

		// Criação dos dados de curvas de nível para o gráfico 2D (vista de cima)
		// Criação dos dados de curvas de nível para o gráfico 2D (vista de cima)
		var dataContour = [
			{
					type: 'contour',
					x: y, // Use os mesmos valores de y do gráfico 3D
					y: x, // Use os mesmos valores de x do gráfico 3D
					z: Z, // Use os mesmos valores de Z do gráfico 3D
					colorscale: 'Viridis', // Use a colorscale Viridis para o degradê de cores
					showscale: false,
					hoverinfo: 'none',
					contours: {
						showlines: false, // Não mostrar as linhas entre as cores
				},
			},
		];

		// Adicione linhas de contorno individuais para cada nível
		for (var level of c_values) {
			var contourLines = {
					type: 'contour',
					x: y, // Use os mesmos valores de y do gráfico 3D
					y: x, // Use os mesmos valores de x do gráfico 3D
					z: contourLevels(x, y, a, b, c, d, e, f), // Use a função de cálculo para obter Z
					colorscale: 'Viridis',
					showscale: false,
					hoverinfo: 'none',
					contours: {
							start: level,
							end: level,
							size: 0,
							coloring: 'lines',
					},
					line: {
							color: 'black',
							width: 2,
					},
			};

			dataContour.push(contourLines);
		}

		var layoutContour = {
				title: 'Contour Map',
				xaxis_title: 'Y',
				yaxis_title: 'X',
				margin: { l: 0, r: 0, b: 0, t: 40 },
				yaxis: {
						type: 'linear',
						range: [-5, 5],
				},
				scene: {
						camera: {
								eye: { x: 1.2, y: 1.2, z: 0.7 },
						},
				},
		};

		// Atualização dos gráficos
		Plotly.react('plotly-graph-3d', data3d, layout3d);
		Plotly.react('plotly-graph-contour', dataContour, layoutContour);
}

// Atualizar valor da quantidade de curvas de nível ou valor da curva de nível ao mover as barras de deslizar
function updateSliderValue() {
	var curvesOption = document.querySelector('input[name="curves-option"]:checked');
	var isSingleCurveOption = curvesOption.value === 'single';

	var levelValueInput = document.getElementById('level-value');
	var curvesValueInput = document.getElementById('curves-value');

	if (isSingleCurveOption) {
			var levelValue = parseFloat(levelValueInput.value);
			document.getElementById('level').value = levelValue;
	} else {
			var curvesValue = parseInt(curvesValueInput.value);
			document.getElementById('curves').value = curvesValue;
	}

	updateGraph();
}


function selectOption(optionId) {
	document.getElementById(optionId).checked = true;
	toggleCurveOptions();
	updateGraph();
}

// Função para alternar entre a opção de "Apenas uma curva de nível" e "Muitas curvas de nível"
function toggleCurveOptions() {
	var singleCurveOption = document.getElementById('single-curve');
	var levelSlider = document.getElementById('level');
	var levelValueInput = document.getElementById('level-value');
	var manyCurvesOption = document.getElementById('many-curves');
	var curvesSlider = document.getElementById('curves');
	var curvesValueInput = document.getElementById('curves-value');

	if (singleCurveOption.checked) {
		// Show only the "Valor da Curva de Nível" slider and hide "Quantidade de Curvas de Nível" slider
		levelSlider.style.display = 'block';
		levelValueInput.style.display = 'block';
		curvesSlider.style.display = 'none';
		curvesValueInput.style.display = 'none';
	} else {
		// Show only the "Quantidade de Curvas de Nível" slider and hide "Valor da Curva de Nível" slider
		levelSlider.style.display = 'none';
		levelValueInput.style.display = 'none';
		curvesSlider.style.display = 'block';
		curvesValueInput.style.display = 'block';
	}
}

function checkValue(input) {
	if (input.value === '') {
			input.value = 0;
		}
	updateGraph();
}

// Atualizar os gráficos inicialmente
updateGraph();

document.getElementById('single-curve').checked = true;
toggleCurveOptions();
