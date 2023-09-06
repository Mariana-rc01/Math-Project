import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
import scipy.integrate


st.sidebar.write("f(x, y)= ax**2 + by**2 + cxy + dx + ey + f")
num_a = st.sidebar.number_input('Insert an integer for a:', value=-1)
num_b = st.sidebar.number_input('Insert an integer for b:', value=-1)
num_c = st.sidebar.number_input('Insert an integer for c:', value=0)
num_d = st.sidebar.number_input('Insert an integer for d:', value=0)
num_e = st.sidebar.number_input('Insert an integer for e:', value=0)
num_f = st.sidebar.number_input('Insert an integer for f:', value=6)
st.sidebar.write("f(x, y)=", num_a, "x**2 +", num_b, "y**2 +", num_c, "xy +", num_d,
                 "x +", num_e, "y + ", num_f)


delta = st.sidebar.select_slider('Select the number of partitions',
                                 options=[3, 5, 10, 30, 60],
                                 value=3)

_x = np.linspace(-2, 2, delta)
_y = np.linspace(-2, 2, delta)
_xx, _yy = np.meshgrid(_x, _y)
x, y = _xx.ravel(), _yy.ravel()

top = num_a*(x ** 2) + num_b*(y ** 2) + num_c*x*y + num_d*x + num_e*y + num_f
# sem zerar !!!!!
# for i in range(len(top)):
#    if top[i] <= 0:
#        top[i] = 0"""
bottom = np.zeros_like(top)
width = depth = abs(x[0] - x[1])


def function(v1, v2, a, b, c, d, e, f):
    return a*(v1 ** 2) + b*(v2 ** 2) + c*v1*v2 + d*v1 + e*v2 + f


a1 = num_a
b1 = num_b
c1 = num_c
d1 = num_d
e1 = num_e
f1 = num_f

start = -2
end = 2
result = scipy.integrate.dblquad(function, start, end, start, end, args=(a1, b1, c1, d1, e1, f1))
answer = round(result[0], 2)
st.write("The approximate result of the double integral of ",
         "f(x, y)=", num_a, "x**2 +", num_b, "y**2 +", num_c, "xy +", num_d,
         "x +", num_e, "y + ", num_f, "[-2,2]x[-2,2]:", answer)
vol = round(sum(width * width * top), 2)

st.write("Total volume of the polygons is: ", vol)

fig = plt.figure(figsize=(10, 10))
ax1 = fig.add_subplot(projection='3d')
ax1.bar3d(x, y, bottom, width, depth, top, shade=False, edgecolor="steelblue", color="skyblue")
ax1.set_xlabel("X")
ax1.set_ylabel("Y")
ax1.set_zlabel("Z")
ax1.set_aspect('equal')

st.pyplot(fig)
