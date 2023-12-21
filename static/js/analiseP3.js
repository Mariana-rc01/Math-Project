//Developed by Mariana Rocha (https://github.com/Mariana-rc01)

// Function to calculate the values of z (f(x, y)) based on the values of x, y, a, b, c, d, e, and g
function f(x, y, a, b, c, d, e, g) {
	return a * x**2 + b * y**2 + c * x * y + d * x + e * y + g;
}

// Function to calculate the partial derivative of f(x, y) with respect to x
function fx(x, y, a, _, c, d, _, _) {
	return 2 * a * x + c * y + d;
}

// Function to calculate the partial derivative of f(x, y) with respect to y
function fy(x, y, _, b, c, _, e, _) {
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

// Function to create the plane that intersects the f graph at the z value of point A
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

// Function to create points on the z=0 plane that have the same z value as point A
function createPointsOnZPlane(pointX, pointY, a, b, c, d, e, h) {
	var pointZ = f(pointX, pointY, a, b, c, d, e, h);
	var points = [];

	// Interval of values for x and y
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

// Function to update the graphs based on the values of a, b, c, d, e, f, and the number of contour lines or the level of the contour line
function updateGraph() {

		// Get the values of a, b, and the number of contour lines or the level of the contour line from the form
		var a = parseFloat(document.getElementById('a').value) || 0; // Default value of 0 for 'a'
		var b = parseFloat(document.getElementById('b').value) || 0; // Default value of 0 for 'b'
		var c = parseFloat(document.getElementById('c').value) || 0; // Default value of 0 for 'c'
		var d = parseFloat(document.getElementById('d').value) || 0; // Default value of 0 for 'd'
		var e = parseFloat(document.getElementById('e').value) || 0; // Default value of 0 for 'e'
		var h = parseFloat(document.getElementById('g').value) || 0; // Default value of 0 for 'f'

		// Get the coordinates of point A
		var pointX = parseFloat(document.getElementById('point-x').value) || 0;
		var pointY = parseFloat(document.getElementById('point-y').value) || 0;

		// Calculate the value of z for point A
		var pointZ = f(pointX, pointY, a, b, c, d, e, h);

		var vector = [fx(pointX, pointY, a, b, c, d, e, h), fy(pointX, pointY, a, b, c, d, e, h)];

		// Creation of point A1 on the graph
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
			name:'A',
		};

		// Creation of point A on the graph
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
			name:'f(w,z)',
		};


		// Creation of the vector for point A1
		var vectorTrace = {
			type: 'scatter3d',
			mode: 'lines+markers',
			x: [pointY, pointY + vector[1]], // Coordinates x of point A1 and the end point of the vector
			y: [pointX, pointX + vector[0]], // Coordinates y of point A1 and the end point of the vector
			z: [0, 0], // Coordinates z of the z=0 plane and the end point of the vector
			marker: {
				color: 'green', // Color of the vector markers
				size: 3,
			},
			line: {
				color: 'green', // Color of the vector line
				width: 2,
			},
			name: 'Gradient vector', // Name of the vector legend
		};

		// Creation of the intersection plane at point A
		var intersectionPlaneAtPointA = createIntersectionPlaneAtPointA(pointX, pointY, a, b, c, d, e, h);

		// Creation of the points on the z=0 plane that have the same z value as point A
		var pointsOnZPlane = createPointsOnZPlane(pointX, pointY, a, b, c, d, e, h);

		// Interval of values for x and y
		var x = [],
				y = [];
		for (var i = -5; i <= 5; i += 0.1) {
				x.push(i);
				y.push(i);
		}

		// Creation of the 3D graph data
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
			pointA1,
			pointA,
			intersectionPlaneAtPointA,
			pointsOnZPlane,
			vectorTrace,
		];

		// Definition of layout options for the graphs
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
						aspectratio: {x:1, y:1, z:1}, // Adjust as needed
						domain: {
								x: [0, 1],
								y: [0, 1],
								z: [0, 0.5] // Adjust for vertical position
						}
				},
		};

		// Update the graphs
		Plotly.react('plotly-graph-3d', data3d, layout3d);
}

function checkValue(input) {
	if (input.value === '') {
			input.value = 0;
		}
	updateGraph();
}

// Update the graphs initially
updateGraph();

