import numpy as np
import matplotlib.pyplot as plt

# Definition of the function f
def f(x, y):
    return x**2 + y**2

# Point A
A = (1, 2)

# Interval and step for grid creation
x_range = np.linspace(-5, 5, 100)
y_range = np.linspace(-5, 5, 100)

# Creating the grid
X, Y = np.meshgrid(x_range, y_range)

# Calculation of f(x, y) values ​​for each grid point
Z = f(X, Y)

# Draw the graph of f(x, y)
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.plot_surface(X, Y, Z, cmap='viridis')
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('f(x, y)')
plt.title('Gráfico de f(x, y)')

# Plot point A and gradient on A
grad_f_x = 2 * A[0]  # Partial derivative of f with respect to x
grad_f_y = 2 * A[1]  # Partial derivative of f with respect to y
ax.scatter(A[0], A[1], f(A[0], A[1]), color='red', label='A')
ax.quiver(A[0], A[1], f(A[0], A[1]), grad_f_x, grad_f_y, 0.1, color='blue', label='Gradiente em A')
ax.legend()

# Move a vector u (applied to A and with norm 1)
u = np.array([1.0, 0.0])  # Vector u
u /= np.linalg.norm(u)  # Normalizes the vector u
ax.quiver(A[0], A[1], f(A[0], A[1]), u[0], u[1], 0.1, color='green', label='Vetor u')
ax.legend()

plt.show()
