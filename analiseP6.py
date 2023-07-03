import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from mpl_toolkits.axes_grid1 import make_axes_locatable

def coordenadas_esfericas(theta_p, phi_p):
    # Definir intervalos de theta e phi
    theta = np.arange(0, 2 * np.pi, 0.1)
    phi = np.arange(0, np.pi, 0.1)

    # Definir o raio da esfera
    r = np.sqrt(4)

    # Criar as coordenadas para 3D
    theta, phi = np.meshgrid(theta, phi)

    # Equações no sistema de coordenadas esféricas
    x = r * np.sin(phi) * np.cos(theta)
    y = r * np.sin(phi) * np.sin(theta)
    z = r * np.cos(phi)

    # Criar a figura e os eixos 3D
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    # Plot da superfície da esfera
    ax.plot_surface(x, y, z, color='lightsteelblue', alpha=0.5)
    ax.plot_wireframe(x, y, z, color='black', linewidths=0.2)

    # Plot do ponto P
    point = ax.scatter([], [], [], color='red', s=100)

    # Ajustar a escala dos eixos para manter a esfera fixa
    max_range = np.array([x.max()-x.min(), y.max()-y.min(), z.max()-z.min()]).max() / 2.0
    mid_x = (x.max()+x.min()) * 0.5
    mid_y = (y.max()+y.min()) * 0.5
    mid_z = (z.max()+z.min()) * 0.5
    ax.set_xlim(mid_x - max_range, mid_x + max_range)
    ax.set_ylim(mid_y - max_range, mid_y + max_range)
    ax.set_zlim(mid_z - max_range, mid_z + max_range)

    # Adicionar um widget de texto para exibir os valores
    ax_text = fig.add_axes([0.7, 0.8, 0.2, 0.1])
    ax_text.axis('off')

    text = ax_text.text(0.5, 0.5, '', ha='center', va='center', fontsize=10)

    # Função para atualizar a posição do ponto P
    def update_point(event):
        nonlocal theta_p, phi_p

        if event.key == 'up':
            phi_p += 0.1
        elif event.key == 'down':
            phi_p -= 0.1
        elif event.key == 'right':
            theta_p += 0.1
        elif event.key == 'left':
            theta_p -= 0.1

        # Atualizar as coordenadas do ponto P
        x_p = r * np.sin(phi_p) * np.cos(theta_p)
        y_p = r * np.sin(phi_p) * np.sin(theta_p)
        z_p = r * np.cos(phi_p)

        # Atualizar a posição do ponto P
        point._offsets3d = ([x_p], [y_p], [z_p])

        # Atualizar o texto
        text.set_text(f'P = ({x_p:.2f}, {y_p:.2f}, {z_p:.2f})\ntheta = {theta_p:.2f}\nphi = {phi_p:.2f}')

        fig.canvas.draw()

    # Registrar a função de atualização do ponto P para eventos de teclado
    fig.canvas.mpl_connect('key_press_event', update_point)

    # Ajustar a visão da esfera para que o ponto P seja exibido à frente
    ax.view_init(elev=10, azim=30)

    # Retornar a figura
    return fig

