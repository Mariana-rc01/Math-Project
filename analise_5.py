import streamlit as st
import numpy as np
import matplotlib.pyplot as plt

delta = st.sidebar.select_slider('Select delta',
                                 options=[2, 3, 5, 9, 17, 33, 65, 129],
                                 value=3)

_x = np.linspace(-2, 2, delta)
_y = np.linspace(-2, 2, delta)
_xx, _yy = np.meshgrid(_x, _y)
x, y = _xx.ravel(), _yy.ravel()

top = -(x**2) - (y**2) + 6
for i in range(len(top)):
    if top[i] <= 0:
        top[i] = 0
bottom = np.zeros_like(top)
width = depth = abs(x[0] - x[1])

fig = plt.figure(figsize=(10, 10))
ax1 = fig.add_subplot(projection='3d')
ax1.bar3d(x, y, bottom, width, depth, top, shade=False, edgecolor="steelblue", color="skyblue")
ax1.set_xlabel("X")
ax1.set_ylabel("Y")
ax1.set_zlabel("Z")
ax1.set_aspect('equal')

st.pyplot(fig)
