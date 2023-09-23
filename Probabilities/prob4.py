import streamlit as st
from scipy.stats import binom
import numpy as np
from scipy.stats import f
from scipy.stats import norm
import plotly.graph_objects as go
from scipy.stats import chi2
import plotly.express as px

opcao = st.sidebar.selectbox("Distribution", ("Normal",
                                              "Chi-squared", "F", "Binomial", "Poisson"))

if opcao == "Normal":
    st.sidebar.subheader("N ~ (0,1)")
    q = st.sidebar.slider('Select the q', 0.001, 0.999, 0.25)
    x = np.linspace(norm.ppf(0.00001),
                    norm.ppf(0.99999), 1000)
    x1 = []
    for i in x:
        if i < norm.ppf(q):
            x1.append(i)
    y1 = list(norm.pdf(x)[:len(x1)])
    y1.append(0)
    x1.append(norm.ppf(q))

    fig = go.Figure()
    fig.add_trace(go.Scatter(x=x, y=norm.pdf(x), mode='lines', name="Area = 1-q",
                             fillcolor="blue", fill="toself",
                             fillpattern=dict(shape="-", fgopacity=0.5)))
    fig.add_trace(go.Scatter(x=x1, y=y1, mode='lines', fill="toself", fillcolor="magenta", name="Area = q"))
    fig.add_trace(go.Scatter(x=[0, x1[-1]], y=[0, 0], mode="markers+text", name="Xq",
                  text=["", round(x1[-1], 3)], textposition="bottom center",
                  textfont=dict(size=15)))
    fig.update_xaxes(zerolinewidth=0.5, zerolinecolor='LightPink')
    fig.add_annotation(x=-2.7, y=0.05, text="Area = q", showarrow=True, arrowcolor="magenta",
                       arrowhead=1, ax=-60, ay=-50, font=dict(size=24, color="magenta"))
    fig.add_annotation(x=2.7, y=0.1, text="Area = 1-q", showarrow=True, arrowcolor="blue",
                       arrowhead=1, ax=60, ay=-30, font=dict(size=24, color="blue"))
    fig.update_layout(title="Probability Density Function",
                      legend=dict(borderwidth=2, font=dict(size=15)))
    st.plotly_chart(fig, theme=None)

    st.sidebar.write("q = ", q, "Xq = ", round(x1[-1], 3))
    xq = norm.ppf(q)
    fig2 = go.Figure()
    fig2.add_trace(go.Scatter(x=x, y=norm.cdf(x), name="Cumulative Density Function",
                              mode='lines'))
    fig2.add_trace(go.Scatter(x=[xq, xq], y=[0, norm.cdf(xq)], mode="lines+markers+text",
                              name="X axis: Xq", text=[round(xq, 3), ""],
                              textposition="bottom center",
                              line=dict(color="blue", dash="dot"),
                              textfont=dict(size=15), marker=dict(color="green")))
    fig2.add_trace(go.Scatter(x=[xq, 0], y=[norm.cdf(xq), q], mode="lines+markers+text",
                              name="Y axis: q", text=["", q], textposition="bottom center",
                              line=dict(color="blue", dash="dot"), textfont=dict(size=15),
                              marker=dict(color="magenta")))
    fig2.update_xaxes(zerolinewidth=0.5, zerolinecolor='LightPink')
    fig2.update_layout(title="Cumulative Density Function",
                       legend=dict(borderwidth=2, font=dict(size=15)))
    st.plotly_chart(fig2, theme=None)

if opcao == "Chi-squared":
    q2 = st.sidebar.slider('Select the q', 0.001, 0.999, 0.25)
    df = st.sidebar.slider('Degress of freedom', 1, 10, 3)
    x = np.linspace(chi2.ppf(0.0000000001, df),
                    chi2.ppf(0.9999999999, df), 1000)
    x1 = []
    for i in x:
        if i < chi2.ppf(q2, df):
            x1.append(i)
    y1 = list(chi2.pdf(x, df)[:len(x1)])
    y1.append(0)
    x1.append(chi2.ppf(q2, df))
    y1[0] = 0
    x1[0] = 0

    fig2 = go.Figure()
    fig2.add_trace(go.Scatter(x=x, y=chi2.pdf(x, df), mode='lines', name="Area = 1-q",
                              fillcolor="blue", fill="tozeroy",
                              fillpattern=dict(shape="-", fgopacity=0.5)))
    fig2.add_trace(go.Scatter(x=x1, y=y1, mode='lines', fill="toself", fillcolor="magenta", name="Area = q"))
    fig2.add_trace(go.Scatter(x=[0, x1[-1]], y=[0, 0], mode="markers+text", name="Xq",
                   text=["", round(x1[-1], 3)], textposition="bottom center",
                   textfont=dict(size=15)))
    fig2.update_xaxes(range=[-3, 30])
    fig2.update_yaxes(range=[-0.1, 0.5])
    fig2.update_xaxes(zerolinewidth=0.5, zerolinecolor='LightPink')
    if df < 3:
        fig2.add_annotation(x=1.8, y=0.35, text="Area = q", showarrow=True, arrowcolor="magenta",
                            arrowhead=1, ax=60, ay=-50, font=dict(size=24, color="magenta"))
        fig2.add_annotation(x=10, y=0.06, text="Area = 1-q", showarrow=True, arrowcolor="blue",
                            arrowhead=1, ax=80, ay=-15, font=dict(size=24, color="blue"))
    elif 3 <= df <= 5:
        fig2.add_annotation(x=2.0, y=0.3, text="Area = q", showarrow=True, arrowcolor="magenta",
                            arrowhead=1, ax=8, ay=-60, font=dict(size=24, color="magenta"))
        fig2.add_annotation(x=10, y=0.05, text="Area = 1-q", showarrow=True, arrowcolor="blue",
                            arrowhead=1, ax=80, ay=-18, font=dict(size=24, color="blue"))
    else:
        fig2.add_annotation(x=3.8, y=0.2, text="Area = q", showarrow=True, arrowcolor="magenta",
                            arrowhead=1, ax=10, ay=-60, font=dict(size=24, color="magenta"))
        fig2.add_annotation(x=19, y=0.06, text="Area = 1-q", showarrow=True, arrowcolor="blue",
                            arrowhead=1, ax=90, ay=-20, font=dict(size=24, color="blue"))

    fig2.update_layout(title="Probability Density Function",
                       legend=dict(borderwidth=2, font=dict(size=15)))
    st.plotly_chart(fig2, theme=None)

    st.sidebar.write("q = ", q2, "Xq = ", round(x1[-1], 3))

    xq = chi2.ppf(q2, df)
    fig3 = go.Figure()
    fig3.add_trace(go.Scatter(x=x, y=chi2.cdf(x, df), name="Cumulative Density Function", mode='lines'))
    fig3.add_trace(go.Scatter(x=[xq, xq], y=[0, chi2.cdf(xq, df)], mode="lines+markers+text",
                              name="X axis: Xq", text=[round(xq, 3), ""],
                              textposition="bottom center", line=dict(color="blue", dash="dot"),
                              textfont=dict(size=15), marker=dict(color="green")))
    fig3.add_trace(go.Scatter(x=[xq, 0], y=[chi2.cdf(xq, df), q2], mode="lines+markers+text",
                              name="Y axis: q", text=["", q2], textposition="bottom center",
                              line=dict(color="blue", dash="dot"), textfont=dict(size=15),
                              marker=dict(color="magenta")))
    fig3.update_xaxes(zerolinewidth=0.5, zerolinecolor='LightPink')
    fig3.update_layout(title="Cumulative Density Function",
                       legend=dict(borderwidth=2, font=dict(size=15)))
    st.plotly_chart(fig3, theme=None)

if opcao == "F":
    q3 = st.sidebar.slider('Select the q', 0.001, 0.999, 0.25)
    df1 = st.sidebar.slider('Degress of freedom 1', 10, 60, 30)
    df2 = st.sidebar.slider('Degress of freedom 2', 10, 60, 30)
    x = np.linspace(f.ppf(0.0000000001, df1, df2),
                    f.ppf(0.9999999999, df1, df2), 3000)
    x1 = []
    for i in x:
        if i < f.ppf(q3, df1, df2):
            x1.append(i)
    y1 = list(f.pdf(x, df1, df2)[:len(x1)])
    y1.append(0)
    x1.append(f.ppf(q3, df1, df2))
    y1[0] = 0
    x1[0] = 0

    fig2 = go.Figure()
    fig2.add_trace(go.Scatter(x=x, y=f.pdf(x, df1, df2), mode='lines', name="Area = 1-q",
                              fillcolor="blue", fill="tozeroy",
                              fillpattern=dict(shape="-", fgopacity=0.5)))
    fig2.add_trace(go.Scatter(x=x1, y=y1, mode='lines', fill="toself", fillcolor="magenta", name="Area = q"))
    fig2.add_trace(go.Scatter(x=[0, x1[-1]], y=[0, 0], mode="markers+text", name="Xq",
                   text=["", round(x1[-1], 3)], textposition="bottom center",
                   textfont=dict(size=15)))
    fig2.update_xaxes(range=[-1, 10])
    fig2.update_yaxes(range=[-0.05, 1.5])
    fig2.update_xaxes(zerolinewidth=0.5, zerolinecolor='LightPink')
    fig2.add_annotation(x=2, y=0.9, text="Area = q", showarrow=True, arrowcolor="magenta",
                            arrowhead=1, ax=60, ay=-50, font=dict(size=24, color="magenta"))
    fig2.add_annotation(x=4.8, y=0.1, text="Area = 1-q", showarrow=True, arrowcolor="blue",
                            arrowhead=1, ax=80, ay=-15, font=dict(size=24, color="blue"))
    fig2.update_layout(title="Probability Density Function",
                       legend=dict(borderwidth=2, font=dict(size=15)))
    st.plotly_chart(fig2, theme=None)

    st.sidebar.write("q = ", q3, "Xq = ", round(x1[-1], 3))

    xq = f.ppf(q3, df1, df2)
    fig3 = go.Figure()
    fig3.add_trace(go.Scatter(x=x, y=f.cdf(x, df1, df2), name="Cumulative Density Function", mode='lines'))
    fig3.add_trace(go.Scatter(x=[xq, xq], y=[0, f.cdf(xq, df1, df2)], mode="lines+markers+text",
                              name="X axis: Xq", text=[round(xq, 3), ""],
                              textposition="bottom center", line=dict(color="blue", dash="dot"),
                              textfont=dict(size=15), marker=dict(color="green")))
    fig3.add_trace(go.Scatter(x=[xq, 0], y=[f.cdf(xq, df1, df2), q3], mode="lines+markers+text",
                              name="Y axis: q", text=["", q3], textposition="bottom center",
                              line=dict(color="blue", dash="dot"), textfont=dict(size=15),
                              marker=dict(color="magenta")))
    fig3.update_xaxes(zerolinewidth=0.5, zerolinecolor='LightPink', range=[-1, 10])
    fig3.update_layout(title="Cumulative Density Function",
                       legend=dict(borderwidth=2, font=dict(size=15)))
    st.plotly_chart(fig3, theme=None)

if opcao == "Binomial":
    q4 = st.sidebar.slider('Select the q', 0.0, 1.0, 0.5)
    n = st.sidebar.slider('Select the n', 1, 10, 5)
    p = st.sidebar.slider('Select the p', 0.01, 0.99, 0.50)
    x = list(range(0, n + 1))
    Xq = int(binom.ppf(q4, n, p))

    x1 = list(range(0, Xq + 1))
    y1 = binom.pmf(x1, n, p)
    x2 = list(range(Xq + 1, n + 1))
    y2 = binom.pmf(x2, n, p)

    fig = go.Figure()
    fig.add_trace(go.Bar(y=y1, x=x1, width=0.01, showlegend=False, opacity=0.7))
    fig.add_trace(go.Scatter(x=x1, y=y1, mode="markers",
                             name="Sum = q", marker=dict(size=14, symbol="diamond", color="magenta")))
    fig.add_trace(go.Scatter(x=[Xq, 0], y=[0, 0], mode="markers+text", text=[Xq, ""],
                             showlegend=True, textposition=["bottom center", "bottom center"],
                             textfont=dict(size=15), name="Xq",
                             marker=dict(size=[12, 1], symbol=["diamond", "diamond"],
                                         color=["green", "green"])))
    fig.add_trace(go.Bar(y=y2, x=x2, width=0.01, showlegend=False, opacity=0.1))
    fig.update_layout(title="Probability Mass Function",
                      legend=dict(borderwidth=1, font=dict(size=15), itemsizing="constant"))
    # fig.update_layout(legend={'itemsizing': 'constant'})
    st.plotly_chart(fig, theme=None)

    xt = list(range(-1, n + 1))
    proba = list(binom.pmf(xt, n, p))

    fig2 = px.ecdf(y=proba, x=xt, markers=True, ecdfmode="standard", opacity=0.6,
                   title="Cumulative Density Function", labels={"x": "Xq"})
    fig2.update_traces(marker=dict(size=13, symbol="circle", color="black", opacity=1))
    fig2.add_trace(go.Scatter(x=[xt[-1], xt[-1] + 1], y=[1, 1], mode="lines", showlegend=False,
                              line=dict(color="black")))
    fig2.add_trace(go.Scatter(x=x, y=binom.cdf(range(-1, n), n, p), mode="markers",
                              marker=dict(size=15, symbol="circle-open", color="black"),
                              showlegend=False))
    fig2.add_trace(go.Scatter(x=[0, Xq], y=[q4, q4], mode="lines+markers+text", name="q",
                              text=[q4, ""], textposition=["middle left", "top left"],
                              textfont=dict(size=15), line=dict(color="blue", dash="dot"),
                              marker=dict(size=(18, 8), symbol=("diamond", "x-open-dot"),
                                          color=("magenta", "blue"))))
    fig2.add_trace(go.Scatter(x=[Xq, Xq], y=[0, q4], mode="lines+markers+text", name="Xq",
                              text=[Xq, ""], textposition=["bottom center", "top left"],
                              textfont=dict(size=15), line=dict(color="blue", dash="dot"),
                              marker=dict(size=(18, 8), symbol=("diamond", "x-open-dot"),
                                          color=("green", "blue"))))
    fig2.update_yaxes(range=[-0.3, 1.3])
    fig2.update_layout(legend=dict(borderwidth=1, font=dict(size=15)))
    st.plotly_chart(fig2, theme=None)
