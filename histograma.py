import streamlit as st
import matplotlib.pyplot as plt
import numpy as np

st.header("Minha dashboard")

mu = st.sidebar.number_input('Média:', step=0.1)

sd = st.sidebar.number_input('SD:', min_value=0.0, value=2.0, step=0.1)

# opcao = st.sidebar.selectbox("Distribuição", ("Normal", "Exponencial"))
s = np.random.normal(mu, sd, 1000)
plt.hist(s, bins=20)

st.pyplot(plt)
