import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Função f(x, y)
def f(x, y):
    return x**2 + y**2

# Intervalo de valores para x e y
x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)
X, Y = np.meshgrid(x, y)

# Valores de z (f(x, y)) para os valores de x e y
Z = f(X, Y)

# Valores de c para as curvas de nível
c_values = np.linspace(np.min(Z), np.max(Z), 10)

# Plot dos gráficos de f(x, y) e curvas de nível
fig = plt.figure(figsize=(12, 6))

# Gráfico de f(x, y)
ax1 = fig.add_subplot(121, projection='3d')
ax1.plot_surface(X, Y, Z, cmap='viridis', alpha=0.5)
ax1.set_xlabel('X')
ax1.set_ylabel('Y')
ax1.set_zlabel('Z')
ax1.set_title('Gráfico de f(x, y)')

# Curvas de nível em planos retangulares
ax2 = fig.add_subplot(122)
ax2.contour(X, Y, Z, levels=30, cmap='viridis')
for c in c_values:
    mask = Z >= c
    Z_masked = np.where(mask, c, np.nan)
    ax1.plot_surface(X, Y, Z_masked, color='red', alpha=0.3, zorder=0)

ax2.set_xlabel('X')
ax2.set_ylabel('Y')
ax2.set_title('Curvas de Nível')

plt.tight_layout()
plt.show()
