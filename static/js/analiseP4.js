//Developed by Mariana Rocha (https://github.com/Mariana-rc01)

// Function to calculate the values of z (f(x, y)) based on the values of x, y, a, b, c, d, e, and h
function f(x, y, a, b, c, d, e, h) {
	return a * x**2 + b * y**2 + c * x * y + d * x + e * y + h;
}

// Function to calculate the partial derivative of f(x, y) with respect to x
function dx(x, y, a, _, c, d, _, _) {
	return 2 * a * x + c * y + d;
}

// Function to calculate the partial derivative of f(x, y) with respect to y
function dy(x, y, _, b, c, _, e, _) {
	return 2 * b * y + c * x + e;
}

// Function to calculate the values of z for the contour lines
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

// Function to find the intersection of points with z = 0
function createPointsOnZPlane(a, b, c, d, e, h) {
	var points = [];

	// Interval of values for x and y
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

// Declare the variable data3d outside the Plotly click event
var data3d = [];
var layout3d;

// Declare the variables clickedX and clickedY outside the updateGraph function
var clickedX, clickedY;

// Add a click event to the Plotly graph
var plotlyGraph = document.getElementById('plotly-graph-3d');
Plotly.newPlot(plotlyGraph, data3d, layout3d);

function updateGraph() {
	// Get the values of a, b, and the number of contour lines or the level of the contour line from the form
	var a = parseFloat(document.getElementById('a').value) || 0; // Default value of 0 for 'a'
	var b = parseFloat(document.getElementById('b').value) || 0; // Default value of 0 for 'b'
	var c = parseFloat(document.getElementById('c').value) || 0; // Default value of 0 for 'c'
	var d = parseFloat(document.getElementById('d').value) || 0; // Default value of 0 for 'd'
	var e = parseFloat(document.getElementById('e').value) || 0; // Default value of 0 for 'e'
	var h = parseFloat(document.getElementById('h').value) || 0; // Default value of 0 for 'f'

	var i = parseFloat(document.getElementById('i').value) || 0; // Default value of 0 for 'i'
	var j = parseFloat(document.getElementById('j').value) || 0; // Default value of 0 for 'j'
	var k = parseFloat(document.getElementById('k').value) || 0; // Default value of 0 for 'k'
	var l = parseFloat(document.getElementById('l').value) || 0; // Default value of 0 for 'l'
	var m = parseFloat(document.getElementById('m').value) || 0; // Default value of 0 for 'm'
	var n = parseFloat(document.getElementById('n').value) || 0; // Default value of 0 for 'n'

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

	// Definition of layout options for the graphs
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

	// Update the graphs
	Plotly.react('plotly-graph-3d', data3d, layout3d);
}

// Function to add new traces to the graph
function addNewTraces(newTraces) {
	// Combine existing traces with new traces
	data3d = data3d.concat(newTraces);
	// Put the code causing the error here
	Plotly.newPlot('plotly-graph-3d', data3d, layout3d);
}

// Declare the plotlyData variable to store elements added to the graph
var plotlyData = [];

// Add a click event to the Plotly graph
plotlyGraph.on('plotly_click', function(data) {
	if (data.points.length > 0) {
		var clickedPoint = data.points[0];
		if (clickedPoint && clickedPoint.x !== undefined && clickedPoint.y !== undefined) {
			clickedX = parseFloat(clickedPoint.y.toFixed(4)); // X coordinate of the clicked point
			clickedY = parseFloat(clickedPoint.x.toFixed(4)); // Y coordinate of the clicked point

			console.log('Coordenadas do ponto clicado - X: ' + clickedX + ', Y: ' + clickedY);

			// Check if the point already exists in the array
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
			// Add new elements to the graph
			addPointAndVectors(clickedX, clickedY);
			}
		}
	}
});

// Function to clear existing traces
function clearTraces() {
	data3d = data3d.filter(trace => trace.name !== 'P' && trace.name !== 'f(P)' && trace.name !== '∇f(P)' && trace.name !== '∇g(P)');
	Plotly.newPlot('plotly-graph-3d', data3d, layout3d);
}

function addPointAndVectors(pointX, pointY) {
	// Get the values of a, b, c, d, e, h, i, j, k, l, m, and n
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

	// Create new graph elements
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

	// Create new graph elements
	var newTraces = [pointP, pointfP, vectorTracef, vectorTraceg];

	addNewTraces(newTraces);
}

function checkValue(input) {
	if (input.value === '') {
			input.value = 0;
		}
	updateGraph();
}

// Event listener for the reset button
document.getElementById('resetButton').addEventListener('click', function() {
	// Reload the JavaScript file
	var scriptElement = document.createElement('script');
	scriptElement.src = 'static/js/analiseP4.js';

	// Remove the previous script (optional)
	var oldScript = document.querySelector('script[src="static/js/analiseP4.js"]');
	if (oldScript) {
			oldScript.remove();
	}

	document.body.appendChild(scriptElement);
});


// Update the graphs initially
updateGraph();

