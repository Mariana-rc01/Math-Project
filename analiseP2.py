import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from mpl_toolkits.mplot3d.art3d import Line3D

# Definição da função f
def f(x, y):
    return x**2 + y**2 + 100

# Definição dos pontos A, vetor v e o vetor e3
A = (1, 1, 0)
v = (1, 2, 0)
e3 = (0, 0, 1)

# Definição do intervalo dos eixos x e y
x = np.linspace(-10, 10, 100)
y = np.linspace(-10, 10, 100)

# Criação da malha para o gráfico 3D
X, Y = np.meshgrid(x, y)
Z = f(X, Y)

# Criação da figura e dos eixos
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# Desenho do gráfico de f
ax.plot_surface(X, Y, Z, cmap='viridis', alpha=0.5)

# Interseção do gráfico de f com o plano gerado por v e e3
t = np.linspace(-1.5, 1.5, 100)
C = v[0] * (A[0] + t * v[0]) + v[1] * (A[1] + t * v[1]) + f(A[0] + t * v[0], A[1] + t * v[1])
curve_c = ax.plot(A[0] + t * v[0], A[1] + t * v[1], C, color='orange', label='Curva C')


# Ponto A
point_A = ax.scatter(A[0], A[1], A[2], color='blue', s=50, label='Ponto A')

# Reta tangente r
tangent_r_x = np.linspace(A[0] - 2, A[0] + 2, 100)
tangent_r_y = np.linspace(A[1] - 2, A[1] + 2, 100)
tangent_r_z = f(A[0], A[1]) + v[0] * (tangent_r_x - A[0]) + v[1] * (tangent_r_y - A[1])
tangent_r = Line3D(tangent_r_x, tangent_r_y, tangent_r_z, color='green', alpha=0.5)
ax.add_line(tangent_r)

# Vetor v
vetor_v = ax.quiver(A[0], A[1], A[2], v[0], v[1], v[2], color='red', label='Vetor v')

# Ponto correspondente no gráfico de f -> Não está a aparecer as retas até ao final dos eixos x e y
ax.plot([A[0], A[0]], [A[1], A[1]], [A[2], f(A[0], A[1])], linestyle='dashed', color='grey')
ax.plot([A[0], 0], [A[1], A[1]], [0, 0], linestyle='dashed', color='grey')
ax.plot([A[0], A[0]], [A[1], 0], [0, 0], linestyle='dashed', color='grey')

# Configuração dos eixos e do título
ax.set_xlabel('x')
ax.set_ylabel('y')
ax.set_zlabel('z')
ax.set_title('Gráfico de f com reta tangente r no ponto A')

# Adicionando a legenda
ax.legend([point_A, tangent_r, vetor_v, curve_c[0]], ['Ponto A', 'Reta tangente r', 'Vetor v', 'Curva C'])

# Mostrar o gráfico
plt.show()
