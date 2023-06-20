import streamlit as st
import matplotlib.pyplot as plt
import numpy as np

st.header("Minha dashboard")

mu = st.sidebar.number_input('Média:')

sd = st.sidebar.number_input('SD:')

# opcao = st.sidebar.selectbox("Distribuição", ("Normal", "Exponencial"))
s = np.random.normal(mu, sd, 1000)
fig, ax = plt.subplots()
ax.hist(s, bins=20)

st.pyplot(fig)
