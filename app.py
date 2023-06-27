from flask import Flask, render_template, request
import numpy as np
import matplotlib.pyplot as plt
import mpld3

app = Flask(__name__, static_folder='static')


@app.route('/', methods=['GET', 'POST'])
@app.route('/index.html')
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


@app.route('/analise.html')
def analise():
    return render_template('analise.html')

@app.route('/analise1.html')
def analise1():
    return render_template('analise1.html')

@app.route('/analise2.html')
def analise2():
    return render_template('analise2.html')

@app.route('/analise3.html')
def analise3():
    return render_template('analise3.html')

@app.route('/analise4.html')
def analise4():
    return render_template('analise4.html')

@app.route('/analise5.html')
def analise5():
    return render_template('analise5.html')

@app.route('/analise6.html')
def analise6():
    return render_template('analise6.html')

@app.route('/probabilidades.html')
def probabilidades():
    return render_template('probabilidades.html')

@app.route('/probabilidades1.html')
def probabilidades1():
    return render_template('probabilidades1.html')

@app.route('/probabilidades1-1.html')
def probabilidades1_1():
    return render_template('probabilidades1-1.html')

@app.route('/probabilidades1-2.html')
def probabilidades1_2():
    return render_template('probabilidades1-2.html')

@app.route('/probabilidades1-3.html')
def probabilidades1_3():
    return render_template('probabilidades1-3.html')

@app.route('/probabilidades2.html')
def probabilidades2():
    return render_template('probabilidades2.html')

@app.route('/probabilidades3.html')
def probabilidades3():
    return render_template('probabilidades3.html')

@app.route('/probabilidades3-1.html')
def probabilidades3_1():
    return render_template('probabilidades3-1.html')

@app.route('/probabilidades3-2.html')
def probabilidades3_2():
    return render_template('probabilidades3-2.html')

@app.route('/probabilidades3-3.html')
def probabilidades3_3():
    return render_template('probabilidades3-3.html')

if __name__ == '__main__':
    app.run(debug=True, port = 3141)
