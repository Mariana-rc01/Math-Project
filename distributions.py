import streamlit as st
import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import binom
from scipy.stats import poisson
from scipy.stats import chi2
from scipy.stats import norm
from scipy.stats import expon
from scipy.stats import t

opcao = st.sidebar.selectbox("Distributions", ("Normal", "Exponential",
                                              "Chi-squared", "T student", "Binomial", "Poisson"))

np.random.seed(999)
if opcao == "Normal":
    st.header("Probability Density Function")
    histog = st.sidebar.checkbox('Histogram')
    curve = st.sidebar.checkbox('Curve', value=True)
    mm = st.sidebar.checkbox('Mean/Median')

    mu = st.sidebar.number_input('Mean:', step=0.5)
    sd = st.sidebar.number_input('Standard Deviation:', min_value=0.0, value=1.0, step=0.5)
    nor1 = np.random.normal(mu, sd, size=1000)
    nor = np.linspace(norm.ppf(0.00000000001, mu, sd), norm.ppf(0.99999999999, mu, sd), 100)

    fig, ax = plt.subplots()
    ax.set_ylabel("Probability Density")
    if curve:
        ax.plot(nor, norm.pdf(nor, mu, sd), 'r-', lw=3, alpha=0.7, label='Normal')
    if histog:
        ax.hist(nor1, 40, range=(-8, 8), density=True, alpha=0.6)
    plt.xlim(-9, 9)
    plt.ylim(0, 0.8)
    if mm:
        plt.axvline(x=mu, color='y', ls="-.", label='Mean and Median')
    plt.legend(bbox_to_anchor=(1.0, 1), loc='upper left')

    st.pyplot(fig)
elif opcao == "Exponential":
    st.header("Probability Density Function")
    histog = st.sidebar.checkbox('Histogram')
    curve = st.sidebar.checkbox('Curve', value=True)
    mm = st.sidebar.checkbox('Mean/Median')

    lambd = st.sidebar.number_input('Lambda:', min_value=0.1, value=2.0, step=0.25)
    beta = 1.0 / lambd
    e = np.random.exponential(scale=beta, size=1000)
    ex = np.linspace(expon.ppf(0.0000001, scale=beta), expon.ppf(0.9999999, scale=beta), 100)

    fig2, ax2 = plt.subplots()
    ax2.set_ylabel("Probability Density")
    if histog:
        ax2.hist(e, 60, range=(-9, 9), density=True, alpha=0.6)
    if curve:
        ax2.plot(ex, expon.pdf(ex, scale=beta), 'r-', lw=3, alpha=0.7, label='Exponential')
    plt.xlim(0, 3)
    plt.ylim(0, 3)
    if mm:
        plt.axvline(x=expon.mean(loc=0, scale=beta), color='y', ls="-.", label='Mean')
        plt.axvline(x=expon.median(loc=0, scale=beta), color='g', ls="-", label='Median')
    plt.legend(bbox_to_anchor=(1.0, 1), loc='upper left')

    st.pyplot(fig2)

elif opcao == "Chi-squared":
    st.header("Probability Density Function")
    histog = st.sidebar.checkbox('Histogram')
    curve = st.sidebar.checkbox('Curve', value=True)
    mm = st.sidebar.checkbox('Mean/Median')

    df = st.sidebar.number_input('Graus de Liberdade:', min_value=1, value=3, step=1)
    qs1 = np.random.chisquare(df, 100)
    qs = np.linspace(chi2.ppf(0.00000001, df), chi2.ppf(0.99999999, df), 100)
    fig3, ax3 = plt.subplots()
    ax3.set_ylabel("Probability Density")
    if histog:
        ax3.hist(qs1, 10, range=(0, 40), density=True, alpha=0.6)
    if curve:
        ax3.plot(qs, chi2.pdf(qs, df), 'r-', lw=3, alpha=0.7, label='Qui-quadrado')
    plt.xlim(0, 40)
    plt.ylim(0, 0.25)
    if mm:
        plt.axvline(x=chi2.mean(df, loc=0, scale=1), color='y', ls="-.", label='Mean')
        plt.axvline(x=chi2.median(df, loc=0, scale=1), color='g', ls="-", label='Median')
    plt.legend(bbox_to_anchor=(1.0, 1), loc='upper left')

    st.pyplot(fig3)

elif opcao == "T student":
    st.header("Probability Density Function")
    histog = st.sidebar.checkbox('Histogram')
    curve = st.sidebar.checkbox('Curve', value=True)
    mm = st.sidebar.checkbox('Mean/Median')

    df2 = st.sidebar.number_input('Degrees of Freedom:', min_value=1, value=4, step=1)
    ts1 = np.random.standard_t(df2, size=100)
    ts = np.linspace(t.ppf(0.000001, df2), t.ppf(0.999999, df2), 100000)
    fig4, ax4 = plt.subplots()
    ax4.set_ylabel("Probability Density")
    if histog:
        ax4.hist(ts1, 40, range=(-9, 9), density=True, alpha=0.6)
    if curve:
        ax4.plot(ts, t.pdf(ts, df2), 'r-', lw=3, alpha=0.7, label='T Student')
    plt.xlim(-9, 9)
    plt.ylim(0, 0.4)
    if mm:
        plt.axvline(x=t.mean(df2, loc=0, scale=1), color='y', ls="-.", label='Mean and Median')
    plt.legend(bbox_to_anchor=(1.0, 1), loc='upper left')

    st.pyplot(fig4)

elif opcao == "Binomial":
    st.header("Probability Mass Function:")

    n = round(st.sidebar.number_input('N Trials:', min_value=0, value=6, step=1))
    p = st.sidebar.number_input('Probability of Success:',
                                min_value=0.0, max_value=1.0, value=0.4, step=0.1)
    # rep = round(st.sidebar.number_input('Quantos Ensaios:', min_value=1, value=1, step=1))
    # s = np.random.binomial(n, p, rep)

    x = range(0, n + 1)  # valores de x =0,1,2,3..ou n
    dados_binom = binom.pmf(x, n, p)  # distribuição dos resultados
    fig5, ax5 = plt.subplots()
    ax5.plot(x, dados_binom, "bD")
    ax5.set_ylabel("Probability Mass")
    ax5.vlines(x, 0, dados_binom, colors='blue', lw=7, alpha=0.3)
    ax5.vlines(x, 0, dados_binom, colors='k', linestyles='-.', lw=1)
    plt.hlines(xmin=-1, xmax=x, y=dados_binom, color="lightgray", linestyles='dotted', alpha=0.5)
    plt.axvline(x=n*p, color='y', ls="-.", label='Mean')
    plt.legend(bbox_to_anchor=(1.0, 1), loc='upper left')

    st.pyplot(fig5)

elif opcao == "Poisson":
    st.header("Probability Mass Function:")

    n2 = st.sidebar.number_input('N total:', min_value=0, value=10, step=1)
    lambd2 = st.sidebar.number_input('Lambda/mean:', min_value=0.1, value=4.5, step=0.25)

    x1 = range(0, n2+1)
    dados_poisson = poisson.pmf(x1, mu=lambd2)

    fig6, ax6 = plt.subplots()
    ax6.plot(x1, dados_poisson, "bD")
    ax6.vlines(x1, 0, dados_poisson, colors='blue', lw=7, alpha=0.3)
    ax6.vlines(x1, 0, dados_poisson, colors='k', linestyles='-.', lw=1)
    ax6.set_ylabel("Probability Mass")
    plt.axvline(x=np.mean(lambd2), color='y', ls="-.", label='Mean')
    plt.hlines(xmin=-1, xmax=x1, y=dados_poisson, color="lightgray", linestyles='dotted', alpha=0.5)
    plt.legend(bbox_to_anchor=(1.0, 1), loc='upper left')

    st.pyplot(fig6)
