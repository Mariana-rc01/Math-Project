import streamlit as st
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import multivariate_normal

st.header("Função Densidade de Probabilidade da lei Normal Bivariada")

mu1 = st.sidebar.number_input('Média1:', value=0.0, step=0.5)
var1 = st.sidebar.number_input('Var1:', min_value=0.0, value=1.0, step=0.5)
mu2 = st.sidebar.number_input('Média2:', value=0.0, step=0.5)
var2 = st.sidebar.number_input('Var2:', min_value=0.0, value=1.0, step=0.5)
covr = st.sidebar.number_input('Cov:', min_value=-0.9, max_value=0.9, value=0.0, step=0.1)

mu = [mu1, mu2]
mcov = [[var1, covr], [covr, var2]]
x = np.linspace(-6, 6, 500)
y = np.linspace(-6, 6, 500)
X, Y = np.meshgrid(x, y)
pos = np.empty(X.shape + (2,))
pos[:, :, 0] = X
pos[:, :, 1] = Y
rv = multivariate_normal(cov=mcov, mean=mu)

fig = make_subplots()
fig.add_trace(go.Surface(x=X, y=Y, z=rv.pdf(pos),
                         colorscale='Viridis', showscale=False))

st.plotly_chart(fig, use_container_width=True)

fig2 = plt.figure()
ax2 = plt.subplot()
ax2.contourf(Y, X, rv.pdf(pos))
ax2.set_xlabel("X 2")
ax2.set_ylabel("X 1")
st.pyplot(fig2)
