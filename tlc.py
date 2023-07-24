import streamlit as st
import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import poisson
from scipy.stats import norm
from scipy.stats import expon
from scipy.stats import bernoulli
from scipy.stats import cauchy

opcao = st.sidebar.selectbox("Distribution", ("Uniform", "Bernoulli",
                                              "Poisson", "Exponential", "Cauchy"))

if opcao == "Uniform":
    numero0 = st.sidebar.number_input('Number of Samples:', min_value=1, value=2, step=5)
    st.sidebar.write("1000 random numbers will be generated between:")
    values = st.sidebar.slider('Select a range of values to sample', -100, 100, (-10, 10))
    means = []
    np.random.seed(999)
    for i in range(numero0):
        rng = np.random.default_rng()
        media = np.mean(rng.integers(low=values[0], high=values[1]+1, size=1000))
        means.append(media)
    x1 = np.linspace(norm.ppf(0.001, np.mean(means), np.std(means)),
                     norm.ppf(0.999, np.mean(means), np.std(means)), 1000)
    y_nor = norm.pdf(x1, np.mean(means), np.std(means))
    fig0, ax0 = plt.subplots()
    ax0.hist(means, density=True, bins="auto")
    ax0.plot(x1, y_nor, "r--", alpha=0.5, label='Gaussian')
    ax0.set_ylabel("Density")
    plt.legend(bbox_to_anchor=(1.0, 1), loc='upper left')
    st.pyplot(fig0)


if opcao == "Bernoulli":
    numero = st.sidebar.number_input('Number of Samples:', min_value=1, value=2, step=5)
    p = st.sidebar.number_input('Probability:', min_value=0.0, max_value=1.0, value=0.2, step=0.1)
    d = bernoulli(p)
    res = []
    for i in range(1000):
        res.append(d.rvs(numero).sum())
    fig, ax = plt.subplots()
    nn, bins, empty = ax.hist(res, bins='auto', density=True)
    x1 = np.linspace(norm.ppf(0.001, np.mean(res), np.std(res)),
                     norm.ppf(0.999, np.mean(res), np.std(res)), 1000)
    y_nor = norm.pdf(x1, np.mean(res), np.std(res))
    ax.plot(x1, y_nor, "r--", alpha=0.5, label='Gaussian')
    ax.set_ylabel("Density")
    plt.legend(bbox_to_anchor=(1.0, 1), loc='upper left')
    fig.tight_layout()
    st.pyplot(fig)
if opcao == "Poisson":
    numero2 = st.sidebar.number_input('Number of Samples:', min_value=1, value=2, step=5)
    lambd = st.sidebar.number_input('Lambda:', min_value=0.1, value=5.0, step=0.25)
    d = poisson(lambd)
    res = []
    for i in range(numero2):
        res.append((d.rvs(size=numero2).mean()))
    x1 = np.linspace(norm.ppf(0.001, np.mean(res), np.std(res)),
                     norm.ppf(0.999, np.mean(res), np.std(res)), 1000)
    y_nor = norm.pdf(x1, np.mean(res), np.std(res))
    fig2, ax2 = plt.subplots()
    ax2.hist(res, bins="auto", density=True)
    ax2.plot(x1, y_nor, "r--", alpha=0.5, label='Gaussian')
    ax2.set_ylabel("Density")
    plt.legend(bbox_to_anchor=(1.0, 1), loc='upper left')
    fig2.tight_layout()
    st.pyplot(fig2)

if opcao == "Exponential":
    numero3 = st.sidebar.number_input('Number of Samples:', min_value=1, value=2, step=5)
    lambd2 = st.sidebar.number_input('Lambda:', min_value=0.1, value=5.0, step=0.25)
    e = expon(lambd2)
    ss = []
    for i in range(numero3):
        ss.append(e.rvs(size=numero3).mean())
    x1 = np.linspace(norm.ppf(0.001, np.mean(ss), np.std(ss)),
                     norm.ppf(0.999, np.mean(ss), np.std(ss)), 1000)
    y_nor = norm.pdf(x1, np.mean(ss), np.std(ss))
    fig3, ax3 = plt.subplots()
    ax3.hist(ss, density=True, bins="auto")
    ax3.plot(x1, y_nor, "r--", alpha=0.5, label='Gaussian')
    ax3.set_ylabel("Density")
    plt.legend(bbox_to_anchor=(1.0, 1), loc='upper left')
    st.pyplot(fig3)

if opcao == "Cauchy":
    numero4 = st.sidebar.number_input('Number of Samples:', min_value=1, value=2, step=5)
    par1 = st.sidebar.number_input('Parameter 1:', value=0.0, step=1.0)
    par2 = st.sidebar.number_input('Parameter 2:', value=1.0, step=1.0)
    e = cauchy(par1, par2)
    cc = []
    for i in range(100):
        cc.append(e.rvs(size=numero4).mean())
    x1 = np.linspace(norm.ppf(0.001, np.mean(cc), np.std(cc)),
                     norm.ppf(0.999, np.mean(cc), np.std(cc)), 1000)
    y_nor = norm.pdf(x1, np.mean(cc), np.std(cc))
    fig4, ax4 = plt.subplots()
    ax4.hist(cc, density=True, bins="auto")
    ax4.plot(x1, y_nor, "r--", alpha=0.5, label='Gaussian')
    ax4.set_ylabel("Density")
    plt.legend(bbox_to_anchor=(1.0, 1), loc='upper left')
    st.pyplot(fig4)
