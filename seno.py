import numpy as np
import matplotlib.pyplot as plt
import mpld3

def calcular_seno(amplitude, frequencia, fase, pontos):
    x = np.linspace(0, 2 * np.pi, pontos)
    y = amplitude * np.sin(frequencia * x + fase)
    return x, y

def plotar_grafico_seno(x, y):
    fig, ax = plt.subplots()
    ax.plot(x, y)
    ax.set_xlabel('x')
    ax.set_ylabel('y')
    ax.set_title('Gráfico da Função Seno')

    # Converter o gráfico para um formato interativo HTML
    html_graph = mpld3.fig_to_html(fig)
    return html_graph
