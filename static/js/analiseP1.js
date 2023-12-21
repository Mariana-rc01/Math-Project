//Developed by Mariana Rocha (https://github.com/Mariana-rc01)

// Function to calculate the values of z (f(x, y)) based on the values of x, y, a, b, c, d, e, and f
function g(x, y, a, b, c, d, e, f) {
	return a * x**2 + b * y**2 + c * x * y + d * x + e * y + f;
}

// Function to calculate contour levels based on the values of x, y, a, b, c, d, e, and f
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

// Function to create the contour plane in the first 3D plot
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

// Function to create horizontal cuts at the positions of contour lines in the 2D plot
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

// Function to create a single cut in the 2D plot
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

// Function to update the plots based on the values of a, b, c, d, e, f, and the number of contour lines or the level of the contour line
function updateGraph() {
		// Check the selected option (apenas uma curva or muitas curvas)
		var singleCurveOption = document.getElementById('single-curve');
		var isSingleCurveOption = singleCurveOption.checked;

		// Get the values of a, b, and the number of contour lines or the level of the contour line from the form
		var a = parseFloat(document.getElementById('a').value) || 0; // Default value of 0 for 'a'
		var b = parseFloat(document.getElementById('b').value) || 0; // Default value of 0 for 'b'
		var c = parseFloat(document.getElementById('c').value) || 0; // Default value of 0 for 'c'
		var d = parseFloat(document.getElementById('d').value) || 0; // Default value of 0 for 'd'
		var e = parseFloat(document.getElementById('e').value) || 0; // Default value of 0 for 'e'
		var f = parseFloat(document.getElementById('f').value) || 0; // Default value of 0 for 'f'
		var curves = parseInt(document.getElementById('curves-value').value); // Default value of 1 for the number of contour lines if the box is empty
		var level = parseFloat(document.getElementById('level-value').value); // Contour line value for the single curve option

		// Update the value of the number of contour lines or the level of the contour line on the slider
		document.getElementById('curves').value = curves;
		document.getElementById('level').value = level;

		// Range of values for x and y
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

		// Creation of contour planes
		var planes = [];
		for (var level of c_values) {
				planes.push(createContourPlane(x, y, a, b, c, d, e, f, level));
		}

		// Creation of 3D plot data
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

		// Layout options for 3D plots
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

		// Layout options for 3D plots
		var dataContour = [
			{
					type: 'contour',
					x: y, // Use the same y values as the 3D plot
					y: x, // Use the same x values as the 3D plot
					z: Z, // Use the same Z values as the 3D plot
					colorscale: 'Viridis', // Use a colorscale Viridis para o degradê de cores
					showscale: false,
					hoverinfo: 'none',
					contours: {
						showlines: false, // Do not show lines between colors
				},
			},
		];

		// Add individual contour lines for each level
		for (var level of c_values) {
			var contourLines = {
					type: 'contour',
					x: y, // Use the same y values as the 3D plot
					y: x, // Use the same x values as the 3D plot
					z: contourLevels(x, y, a, b, c, d, e, f), // Use the calculation function to get Z
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

		// Update the plots
		Plotly.react('plotly-graph-3d', data3d, layout3d);
		Plotly.react('plotly-graph-contour', dataContour, layoutContour);
}

// Update the value of the number of contour lines or the level of the contour line when moving the sliders
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

// Function to select an option and update the graph
function selectOption(optionId) {
	document.getElementById(optionId).checked = true;
	toggleCurveOptions();
	updateGraph();
}

// Function to toggle between the "Single Contour" and "Multiple Contours" options
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

// Function to check if the input value is empty and update the graph
function checkValue(input) {
	if (input.value === '') {
			input.value = 0;
		}
	updateGraph();
}

// Update the graphs initially
updateGraph();

document.getElementById('single-curve').checked = true;
toggleCurveOptions();
