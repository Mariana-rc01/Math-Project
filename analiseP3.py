import numpy as np
import matplotlib.pyplot as plt

# Função f(x, y)
def f(x, y):
    return x**2 + y**2

# Ponto A
A = (1, 2)

# Intervalo e passo para criação do grid
x_range = np.linspace(-5, 5, 100)
y_range = np.linspace(-5, 5, 100)

# Criação do grid
X, Y = np.meshgrid(x_range, y_range)

# Cálculo dos valores de f(x, y) para cada ponto do grid
Z = f(X, Y)

# Desenhar o gráfico de f(x, y)
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.plot_surface(X, Y, Z, cmap='viridis')
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('f(x, y)')
plt.title('Gráfico de f(x, y)')

# Plotar ponto A e gradiente em A
grad_f_x = 2 * A[0]  # Derivada parcial de f em relação a x
grad_f_y = 2 * A[1]  # Derivada parcial de f em relação a y
ax.scatter(A[0], A[1], f(A[0], A[1]), color='red', label='A')
ax.quiver(A[0], A[1], f(A[0], A[1]), grad_f_x, grad_f_y, 0.1, color='blue', label='Gradiente em A')
ax.legend()

# Fazer mover um vetor u (aplicado em A e de norma 1)
u = np.array([1.0, 0.0])  # Vetor u, altere os valores conforme necessário
u /= np.linalg.norm(u)  # Normaliza o vetor u
ax.quiver(A[0], A[1], f(A[0], A[1]), u[0], u[1], 0.1, color='green', label='Vetor u')
ax.legend()

plt.show()
