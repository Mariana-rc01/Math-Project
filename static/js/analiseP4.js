// Função para calcular os valores de z (f(x, y)) com base nos valores de x, y, a, b, c, d, e e h
function f(x, y, a, b, c, d, e, h) {
	return a * x**2 + b * y**2 + c * x * y + d * x + e * y + h;
}

// Função para calcular os valores de g(x,y) = 0
function g(x, y, i, j, k, l, m, n) {
	return i * x**2 + j * y**2 + k * x * y + l * x + m * y + n;
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

// Calcula os pontos de interseção entre as superfícies f(x, y) e g(x, y) = 0
function calculateIntersectionPoints(Z_f, Z_g) {
	var intersectionPoints = [];
	var numRows = Math.min(Z_f.length, Z_g.length);
	var numCols = Math.min(Z_f[0].length, Z_g[0].length);

	for (var i = 0; i < numRows; i++) {
			for (var j = 0; j < numCols; j++) {
					if (Z_f[i][j] === Z_g[i][j]) {
							intersectionPoints.push({ x: y[j], y: x[i], z: 0 }); // Adiciona pontos à linha de interseção no plano z = 0
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

		// Intervalo de valores para x e y
		var x = [],
				y = [];
		for (var i = -5; i <= 5; i += 0.1) {
				x.push(i);
				y.push(i);
		}

		// Criação dos dados do gráfico 3D
		var Z_f = contourLevels(x, y, a, b, c, d, e, h);
		var Z_g = contourLevels(x, y, i, j, k, l, m, n);
		var intersectionPoints = calculateIntersectionPoints(Z_f, Z_g); // Calcula os pontos de interseção
		
		// Criação dos dados da linha de interseção
		var lineData = {
				type: 'scatter3d', // Usar scatter3d para representar os pontos da interseção como uma linha
				mode: 'lines',
				x: intersectionPoints.map(point => point.x),
				y: intersectionPoints.map(point => point.y),
				z: intersectionPoints.map(point => point.z),
				line: {
						color: 'red', // Ajuste a cor da linha de interseção conforme desejado
						width: 2, // Ajuste a largura da linha de interseção conforme desejado
				},
				name: 'Interseção',
		};

		var data3d = [
				lineData, // Adicionar a linha de interseção aos dados
				{
						type: 'surface',
						x: y,
						y: x,
						z: Z_f,
						colorscale: 'Viridis',
						showscale: false,
						name: 'f(x, y)',
				},
				{
						type: 'surface',
						x: y,
						y: x,
						z: Z_g,
						colorscale: 'Greys', // Escolha uma escala de cores adequada para o plano g(x, y) = 0
						showscale: false,
						opacity: 0.5, // Ajuste a opacidade conforme desejado
						name: 'g(x, y) = 0',
				},
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

/* Temos depois então um ponto P com coordenadas (p,q), este ponto P está na projeção abaixo do gráfico f, sendo a interseção do gráfico f com g(x,y)=0
Imaginando agora que temos f(x,y) = x²+y² e g(x,y) = 3x²+2y², desenhámos vetores u e v, sendo que u = (2p,2q), sendo p e q coordenadas de P e os coeficientes a derivada de x² e y², e desenhámos v=(6p,4q), sendo 6 e 4 a derivada de 3x² e 2y²
Não é necessário haver a opção de uma ou muitas curvas de nível, visto que é só para mostrar a projeção da interseção do gráfico f com g(x,y)=0
O objetivo é haver uma barra que possámos andar com ela que faz com que o ponto P se mexa à volta da curva de nível projetada e que apareçam os valores de p e q enquanto se move, não é suposto inserirmos p e q
É necessário acrescentares a função g também com valores variáveis e desenhares no gráfico 3D, sem esquecer se fazer a projeção da interseção, há linhas de código que tens que mudar totalmente
*/
