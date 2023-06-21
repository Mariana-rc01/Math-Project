import streamlit as st
import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import binom


st.header("Funções densidade de probabilidade")

opcao = st.sidebar.selectbox("Distribuição", ("Normal", "Exponencial", "Binomial"))

if opcao == "Normal":
    mu = st.sidebar.number_input('Média:', step=0.5)
    sd = st.sidebar.number_input('SD:', min_value=0.0, value=1.0, step=0.5)

    nor = np.random.normal(mu, sd, size=1000)
    fig, ax = plt.subplots()
    count, bins, ignored = ax.hist(nor, 40, range=(-9, 9), density=True)
    y1 = 1/(sd * np.sqrt(2 * np.pi)) * np.exp(- (bins - mu)**2 / (2 * sd**2))
    plt.plot(bins, y1, linewidth=2, color='r', label='Gaussiana')
    plt.xlim(-9, 9)
    plt.ylim(0, 0.5)
    plt.axvline(x=mu, color='y', ls="-.", label='Média e Mediana')
    plt.legend(bbox_to_anchor=(1.0, 1), loc='upper left')

    st.pyplot(fig)
elif opcao == "Exponencial":
    lambd = st.sidebar.number_input('Lambda:', min_value=0.1, value=2.0, step=0.25)
    beta = 1.0 / lambd
    e = np.random.exponential(scale=beta, size=1000)
    fig2, ax2 = plt.subplots()
    count, bins, ignored = ax2.hist(e, 60, range=(-9, 9), density=True)
    y = (1 / beta) * np.exp(-1.0 * bins / beta)
    plt.plot(bins, y, color='red', label='Exponencial')
    plt.xlim(0, 2)
    plt.ylim(0, 2)
    plt.axvline(x=np.mean(e), color='y', ls="-.", label='Média')
    plt.axvline(x=np.median(e), color='g', ls="-", label='Mediana')
    plt.legend(bbox_to_anchor=(1.0, 1), loc='upper left')

    st.pyplot(fig2)
elif opcao == "Binomial":
    n = round(st.sidebar.number_input('N Tentativas:', min_value=0, value=1, step=1))
    p = st.sidebar.number_input('Probabilidade de sucesso:',
                                min_value=0.0, max_value=1.0, value=0.5, step=0.1)
    rep = round(st.sidebar.number_input('Quantos Ensaios:', min_value=1, value=1, step=1))
    s = np.random.binomial(n, p, rep)

    x = range(0, n + 1)  # valores de x =0,1,2,3..ou n
    p_x = binom.pmf(x, n, p)  # distribuição dos resultados
    fig3, ax3 = plt.subplots()
    ax3.bar(x, p_x)
    plt.plot(x, p_x, color='red', label='Binomial')
    plt.axvline(x=n*p, color='y', ls="-.", label='Média')
    plt.legend(bbox_to_anchor=(1.0, 1), loc='upper left')

    st.pyplot(fig3)


