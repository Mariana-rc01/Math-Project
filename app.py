from flask import Flask, render_template, request
import numpy as np
import matplotlib.pyplot as plt
import mpld3

app = Flask(__name__, static_folder='static')


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        amplitude = float(request.form['amplitude'])
        frequencia = float(request.form['frequencia'])
        fase = float(request.form['fase'])
        pontos = int(request.form['pontos'])

        # Geração dos pontos da função seno
        x = np.linspace(0, 2 * np.pi, pontos)
        y = amplitude * np.sin(frequencia * x + fase)

        # Plotagem do gráfico
        fig, ax = plt.subplots()
        ax.plot(x, y)
        ax.set_xlabel('x')
        ax.set_ylabel('y')
        ax.set_title('Gráfico da Função Seno')

        # Converter o gráfico para um formato interativo HTML
        html_graph = mpld3.fig_to_html(fig)

        return render_template('index.html', graph_data=html_graph)

    return render_template('index.html', graph_data=None)

if __name__ == '__main__':
    app.run(debug=True, port = 3141)
