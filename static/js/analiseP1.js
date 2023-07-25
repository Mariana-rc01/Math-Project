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
		var a = parseFloat(document.getElementById('a').value) || 1; // Valor padrão de 1 para 'a'
		var b = parseFloat(document.getElementById('b').value) || 1; // Valor padrão de 1 para 'b'
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

				// Create the single cut for the 2D contour graph
				var singleCut = createSingleCut(x, y, a, b, c, d, e, f, level);

				// Criação dos dados dos gráficos
				var dataContour = [
						{
								type: 'contour',
								x: y,
								y: x,
								z: contourLevels(x, y, a, b, c, d, e, f),
								colorscale: 'Viridis',
								zmin: minZ,
								zmax: maxZ,
						},
						singleCut,
				];
		} else {
				// For the many curves option, generate c_values based on the number of curves
				for (var k = 0; k < curves; k++) {
						c_values.push(minZ + (k / (curves - 1)) * (maxZ - minZ));
				}

				// Criação dos cortes horizontais no gráfico 2D
				var cuts = createCuts(x, y, a, b, c_values, c, d, e, f);

				// Criação dos dados dos gráficos
				var dataContour = [
						{
								type: 'contour',
								x: y,
								y: x,
								z: contourLevels(x, y, a, b, c, d, e, f),
								colorscale: 'Viridis',
								zmin: minZ,
								zmax: maxZ,
						},
				].concat(cuts);
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
				},
		].concat(planes);

		// Definição das opções de layout dos gráficos
		var layout3d = {
				title: 'Gráfico 3D Interativo',
				xaxis_title: 'Y',
				yaxis_title: 'X',
				zaxis_title: 'Z',
				scene: {
						camera: {
								eye: { x: 1.2, y: 1.2, z: 0.7 },
						},
				},
		};

		var layoutContour = {
				title: 'Gráfico de Curvas de Nível',
				xaxis_title: 'Y',
				yaxis_title: 'X',
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

		if (isSingleCurveOption) {
				var levelValue = document.getElementById('level').value;
				document.getElementById('level-value').value = levelValue;
		} else {
				var curvesValue = document.getElementById('curves').value;
				document.getElementById('curves-value').value = curvesValue;
		}
		updateGraph();
}

// Função para alternar entre a opção de "Apenas uma curva de nível" e "Muitas curvas de nível"
function toggleCurveOptions() {
		var curvesOption = document.querySelector('input[name="curves-option"]:checked');
		var isSingleCurveOption = curvesOption.value === 'single';
		var levelSliderContainer = document.getElementById('level-slider-container');
		var curvesSliderContainer = document.getElementById('curves-slider-container');

		if (isSingleCurveOption) {
				levelSliderContainer.style.display = 'block';
				curvesSliderContainer.style.display = 'none';
		} else {
				levelSliderContainer.style.display = 'none';
				curvesSliderContainer.style.display = 'block';
		}
		updateGraph();
}

// Check if the input value is empty and set the default values
function checkValue(input) {
		if (input.value === '') {
				if (input.id === 'a' || input.id === 'b') {
						input.value = 1;
				} else {
						input.value = 0;
				}
		}
		updateGraph();
}

// Atualizar os gráficos inicialmente
updateGraph();