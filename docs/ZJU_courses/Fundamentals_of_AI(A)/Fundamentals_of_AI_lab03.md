---
title: 人工智能基础（A）-lab3-sklearn-学习指南
created: 2025/03/26
last_modified: 2025/09/01
tags:
  - ZJU
  - Fundamentals_of_AI
author: PlutoKirin
summary: 24-25春夏学期人工智能基础（A）lab3食用指南
---
# 人工智能基础（A）-lab3-sklearn-学习指南
## 前言
（截至至2025年春夏学期）本课程还是面临着课堂与实践过于割裂的问题，课程提供的 lab 文档也存在一些语法错误与渲染问题，下面我将勘误版附上，非本课程的同学们也可以体验下 lab

在修读本课程期间，身边的大部分同学，也包括我自己，做 lab 时都是知其然而不知其所以然的状态，因此自行学习并写了这篇 lab 笔记。同学们可以先结合原 lab 文档进行实践，也可以直接看我写的笔记，我已将源代码贴入，**如有错误还请大家指正**

<iframe src="../Fundamentals_of_AI_lab03.pdf" width="100%" height="600px"></iframe>

<mark style="background: #FF5582A6;">再次提醒，本文档仅作学习交流使用，请勿直接抄袭或作他用</mark>

## 1.sklearn 安装
```python
pip install scikit-learn
```

这部分并未明显的问题，无论是在哪个虚拟环境运行以上代码没关系，因为 `scikit-learn` 会安装在默认路径，而其他环境在 Jupyter notebook 基本都已配好
## 2.sklearn 基本用法
[scikit-learn参考资料](https://scikit-learn.org/0.21/documentation.html)

通过文档学习得知，使用sklearn大致可分为4步：数据预处理、训练模型、预测模型以及模型评估
### 2.1 数据预处理
```python
import numpy as np
from sklearn.model_selection import train_test_split
np.random.seed(0)
X = 2 * np.random.rand(100, 1)
# 生成100个随机点
y = 3 * X.flatten() + 2 + np.random.randn(100) * 0.5 
# y = 3x + 2 加入噪声
# 将数据分为训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```
>这里的数据通常需要从文件读入并做一些预处理，下文示例的数据将直接由sklearn 库提供。

这一步主要是生成了随机数据并且将其分为不等的训练集和测试集，其中`random_state`数值实质为一个`Random Seed`，其决定了一系列伪随机数，即若`Seed`相同，生成的随机数序列也会相同。

`Random Seed`主要可用于结果的复现、反复调试与控制变量。
`
test_size` 则指定了测试集（Test Set）在原始数据集中的比例（或是绝对数量）

- 若 input float (0.1, 0.2, etc.)，表示测试集占总数据的比例
- 若 input int (100, 200, etc.)，表示测试集的具体样本数
### 2.2 模型预测
```python
from sklearn.linear_model import LinearRegression
# 创建线性回归模型
model = LinearRegression()
# 训练模型
model.fit(X_train, y_train)
```
>模型预测主要就是创建sklearn库提供的模型实例（传入一定参数），然后直接调用模型实例的 fit 方法

这一步进行了创建线性回归模型与训练模型两步，在`model = LinearRegression()`后，`model`为一个空的线性回归模型框架，处于待定状态等待接收数据进行训练，另外在`LinearRegression()`中可以设置若干参数，最具代表性的为

- `fit_intercept = True ? False`是否拟合截距（例如`y=wx+b`中的`b`）
- `normalize`是否标准化数据，但是适用场景比较落后，现在一般使用 `StandardScaler` 库

*其他参数大家可自行了解，在此不再总结*

而`model.fit(X_train,y_train)`使用两个训练数据来训练模型，在训练过程中模型会通过优化算法（如最小二乘法或梯度下降）找到使均方误差最小的权重w与截距b

在训练完成后，模型的权重和截距被确定，并且存储在模型对象中

其中可以通过`model.coef_`与`model.intercept_`分别查看权重与截距

```python
print(model.coef_)
print(model.intercept_)
'''
[[-0.44225464 -0.26753796 -0.44330664 -0.55780632 -0.4069516   0.37987226
  -0.74188268 -0.76817218  0.08317684  0.39271469 -1.17562961 -0.11157477
  -0.74057475 -0.92940205 -0.16630729  0.82270571  0.09166769 -0.24909698
   0.46980644  0.39025907 -0.99755865 -1.07929872 -0.90386913 -1.01282487
  -0.49054997 -0.00195743 -0.81684198 -0.59189682 -0.9649104  -0.74824916]]
[0.29500272]
'''
```

>[!question] Q & A
> Q: 为什么这里 `model.coef_` 有这么多取值？
> 
> A:  `model.coef_` 数组中的每一个数据对应一个单独的测试样本 $X_{i} = [x_{i1},x_{i2},\dots,x_{in}]$ 的权重
### 2.3 模型预测
```python
# 进行预测
y_pred = model.predict(X_test)
```
>模型进行 fit 训练后便可以调用 predict 方法来对测试集进行预测

`y_pred = model.predict(X_test)`会对每一个测试样本，即`X_test`所包含的参数，即$X_{i} = [x_{i1},x_{i2},\dots,x_{in}]$，通过以下公式计算模型的预测值 $\hat y_i$

$$\hat{y}_i = w_1 x_{i1} + w_2 x_{i2} + \dots + w_n x_{in} + b$$

在对所有测试样本计算完成后，会返回一个包含所有预测值的数组并且赋至`y_pred`
### 2.4 模型评估
```python
from sklearn.metrics import mean_squared_error, r2_score
# 计算性能指标
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
```
>最后需要对模型的预测结果对模型的性能进行评估。常用的评估函数有均方误差(MSE)与决定系数 $(R^2)$ 。

MSE与 $R^2$ 的公式分别为

$$\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2$$

$$R^2 = 1 - \frac{\sum_{i=1}^{n} (y_i - \hat{y}_i)^2}{\sum_{i=1}^{n} (y_i - \bar{y})^2}$$

- MSE即预测误差平方的平均值，衡量模型的预测精度，越小模型预测越好
- $R^2$即模型对目标变量方差的解释比例，取值范围为 $\left(-\infty,1\right]$，越接近1模型预测越好
### 2.5 结果可视化
```python
import matplotlib.pyplot as plt
# 原始数据与预测值的可视化
plt.scatter(X, y, color='blue', label='target', s=10)
X_line = np.linspace(0, 2, 100).reshape(-1, 1)
# 创建用于绘制回归线的X值
y_line = model.predict(X_line)
plt.plot(X_line, y_line, color='red', linewidth=2, label='predition')
plt.xlabel('X')
plt.ylabel('y')
plt.title("y = 3x + 2")
plt.legend()
plt.grid()
```
>需要的话，可以对模型的输出进行可视化

此处主要是对于 `matplotlib.pyplot` 库与 `numpy` 库的调用，下面只总结 `y_line = model.predict(X_line)` ，该句使用训练好的线性回归模型对 `X_line` 进行预测，得到拟合线的值

---
## 3.加州房价预测——Demo
>下面提供一个示例，实验用到本实验将使用加州房价数据集。该数据集包含不同特 征（如房间数、房龄、主人收入等）以及相应的房价信息。目标是构建一个模型来预测房价。
### 3.1 数据加载与查看
```python
from sklearn.datasets import fetch_california_housing
import pandas as pd

# 加载数据集
cal = fetch_california_housing()

'''
注，若下载数据集失败，改用下面代码。其中xxx为数据集文件在你本地目录的位置，学 在浙大将附上数据集。比如文件位置为"D:\Code\cal_housing_py3.pkz"（在文件资源管 理器右键点击属性可看到文件路径），那么xxx填"D:\\Code "（所有的\都要写成\\）
cal = fetch_california_housing(data_home="xxx",download_if_missing=False)
'''

# 得到样本特征与样本目标值
X = pd.DataFrame(cal.data, columns=cal.feature_names)
y = cal.target

# 数据概览
print(X.head())
print(y[:5])
```
>这里通过库函数直接加载数据集并查看数据集的基本情况

此处数据的加载过程与 $2. sklearn 基本用法$ 相关内容并无区别

其中 `cal = fetch_california_housing()` 将加州房价的数据集赋至 `cal` 
### 3.2 数据预处理
```python
from sklearn.model_selection import train_test_split

# 检查缺失值
print(X.isnull().sum())

# 划分数据集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```
>这里检查数据的缺失值（数据集的某些样本可能数据不完整），并决定是否填充或 删除这些值（加州房价数据集中没有缺失值），并将数据分为训练集和测试集，使用 80% 的数据用于训练，20% 用于测试

此处数据预处理与 $2.1 数据预处理$ 相关内容并无大的区别

>[!question] Q & A
> Q: 为什么 `print(X.isnull().sum*())` 的结果显示都是 `0` ？
> 
> A: `isnull().sum()`用于统计每个特征值中的缺失值，而经过数据的预先清洗，原始数据本身不含缺失值
### 3.3 模型训练
```python
from sklearn.linear_model import LinearRegression

# 创建模型
model = LinearRegression()

# 训练模型
model.fit(X_train, y_train)
```
>这里创建线性回归模型，并进行拟合训练

此处模型训练与 $2.2 模型预测$ 相关内容并无区别
### 3.4 模型评估
```python
from sklearn.metrics import mean_squared_error, r2_score

# 进行预测
y_pred = model.predict(X_test)

# 计算性能指标
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# 打印性能指标
print(f'均方误差 (MSE): {mse}')
print(f'决定系数 (R^2): {r2}')
```
>这里对训练好的模型进行评估，对测试集进行预测，并计算模型性能指标

此处模型评估与 $2.3模型预测\&2.4 模型评估$ 相关内容并无区别
### 3.5 可视化结果
```python
import matplotlib.pyplot as plt

plt.scatter(y_test, y_pred, color='blue', alpha=0.6)
plt.xlabel('target')
plt.ylabel('prediction')
plt.title('target vs prediction')
plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], color='red', linewidth=2) # 理想预测线
plt.show()
```
>这里通过绘制真实值与预测值的散点图，直观展示模型的拟合效果

此处模型训练与 $2.5 结果可视化$ 相关内容并无区别
## 乳腺癌检测——思路

### 1. 数据加载与查看
- 导入库：`sklearn.datasets`（机器学习数据集）和`pandas`（数据处理）
- 加载了一个关于乳腺癌的数据集，这个数据集包含了：
- 查看了数据集的基本信息：
	- 特征名称
	- 目标类别
	- 特征数据形状
	- 目标数据形状

### 2. 数据预处理
- 首先检查了数据是否有缺失值（发现没有缺失值）
- 把数据分成两部分：
	- 训练集（75%）：用来训练模型
	- 测试集（25%）：用来测试模型训练情况
- 对数据进行了标准化处理（把所有特征缩放到相似的数值范围），因为：
	- 不同特征的数值大小可能差很多（比如一个特征范围0-1，另一个0-1000）
	- 标准化后能帮助模型更好地学习

### 3. 模型训练
- 选择了逻辑回归模型（虽然名含“回归”，实际用于分类）
- 用训练集数据训练模型学习特征和肿瘤类型之间的关系

### 4. 模型评估
- 让模型对测试集进行预测
- 计算了准确率（预测正确的比例）
- 打印出了模型的系数和截距（这些数字代表了模型学到的"规律"）
### hw 源代码（仅供参考）
在阶段性测试和期中期末考都有代码的考察，请修读该课程的同学注意实践，**请勿直接复制粘贴！**
```python
# 数据加载与查看

from sklearn.datasets import load_breast_cancer
import pandas as pd
# 加载乳腺癌数据集
bre=load_breast_cancer()
# 得到样本特征与样本目标值
X = pd.DataFrame(bre.data, columns=bre.feature_names)
y = bre.target
# 查看数据集的基本情况
print("特征名称:", bre.feature_names)
print("目标类别:", bre.target_names)
print("特征数据形状:", X.shape)
print("目标数据形状:", y.shape)

# 数据预处理

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# 检查缺失值
print(X.isnull().sum())
# 划分数据集
X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.25,random_state=3149)
# 标准化处理
scaler=StandardScaler()
X_train=scaler.fit_transform(X_train)
X_test=scaler.transform(X_test)

# 模型训练
from sklearn.linear_model import LogisticRegression
# 创建逻辑回归模型
model = LogisticRegression()
# 训练模型
model.fit(X_train, y_train)

# 模型评估

from sklearn.metrics import accuracy_score
# 进行预测
y_pred = model.predict(X_test)
# 计算准确率
accuracy = accuracy_score(y_test, y_pred)
# print 性能指标
print(f'测试集准确率(ACCURACY):{accuracy}')
```