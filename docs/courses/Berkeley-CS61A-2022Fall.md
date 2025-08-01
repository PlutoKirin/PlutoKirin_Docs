# CS61A Note
# Lecture 1 Computer Science
```python
shakes = open('shekespeare.txt')
text = shakes.read().split()
text.count('the')

words=set(text)
# in a set something only shows up once

```
# Lecture 2 Functions
```python
max(2,4)
min(-2,50000)
form operator import add,mul
add(2,3)
mul(2,3)
max(1,2,3,4,5)
```
# Lecture 3 Control
```python
None
# noting

print(None)
# output None，其返回值是None

print(print(1),print(2))
# output
# 1
# 2
# None None
```

Pure Functions
just return values
```python
abs(-2)
pow(2,100)
```

Non-Pure Functions
have side effects
```python
print(-2)
# display the output "-2" and return None
```

Def statement:
```python
square(x):
return mul(x,x)
```
Call expression: `square(2+2)`
Calling/Applying
```python
from operator import mul
def square(x):
	return mul(x,x)
square(square(3))
```

```python
from operator import truediv,floordiv,mod
truediv(2024,10)
floordiv(2024,10)
mod(2024,10)
```
去学vim！

## Conditional statement
what's demo? demonstration——演示
```python
def absolute_value(x):
	if x<0:
		return -x
	elif x==0:
		return 0
	else:
		return x
```
False values in Python: `False`, `0` , `''`, `None`
True values in Python: Anything else

## Iteration
```python
i,total=0,0
while i<3:
	i=i+1
	total=total+i
```

# Lecture 4 Higher-Order Functions
## Prime Factorization
```python
"""My code"""
"""
def print_theend(num):
    temp=num
    k=smallest_the_prime_num(num)
    while k!=temp:
        k=smallest_the_prime_num(num)
        num=num/k
        print(k)
"""
def print_theend(num):
	while num>1:
		k=smallest_the_prime_num(num)
		num=num//k
		print(k)
def smallest_the_prime_num(num):
    temp=2
    while num%temp!=0:
        temp=temp+1
    return temp
num=int(input("Please input a number then it will output the prime factorition: "))
print_theend(num)

"""The demo code"""
def prime_factors(n):
	while n>1:
		k=smallest_prime_factor(n)
		n=n//k
		print(k)
def smallest_prime_factor(n):
	k=2
	while n%k!=0:
		k=k+1
	return k
```
## The Fibonacci Sequence
0, 1, 1, 2, 3, 5, 8, 13 etc.
Demo
```python
def fib(n):
	"""Compute the nth Fibonacci number, for N >= 1."""
	pred, curr = 0, 1
	k=1
	while k<n:
		pred, curr = curr, pred + curr
		k=k+1
	return curr
```
# Lecture 5 Environments
![[Pasted image 20250225102308.png]]

## Environments for Nested Definitions
```python
def make_adder(n):
	def adder(k):
		return k+n
	return adder
add_three = make_adder(3)
add_three(4)
```

## Local Names
## Function Compostion
## Lambda Expressions
Lambda 表达式是通过指定两个 things：参数和 return 表达式。
```python
lambda <parameters>: <return expression>
```
## Currying
```python
def make_adder(n):
	return lambda k: n+k
```

```python
def curry2(f):
	def g(x):
		def h(y):
			return f(x,y)
		return h
	return g
```

# Lecture ? Recursion
## Self-Reference
```python
def print_sums(x):
	print(x)
	def next_sum(y):
		return print_sums(x+y)
	return next_sum

print_sums(1)(3)(5)
# output 1 4 9
```

## Recursive Functions
```python
def split(n):
	return n // 10, n % 10
'''
input
all_but_last, last = split(2025)
then
all_but_last == 202
last == 5
'''

def sum_digits(n):
	if n < 10:
		return n
	else:
		all_but_last, last = split(n)
		return sum_digits(all_but_last) + last
	
```

## Recursion in Environment Diagrams

```python
def fact(n):
	if n == 0:
		return 1
	else:
		return n * fact(n-1)
print(fact(3))
```

## Verifying Recursive Functions
> [!note] Is fact implemented correctly?
> 1. Verify the base case.
> 2. Treat fact as a functional abstraction!
> 3. Assume that fact(n-1) is correct.
> 4. Verify that fact(n) is correct, assuming that fact(n-1) correct.

## Mutual Recursion
```python
def luhn_sum(n):
	if n < 10:
		return n
	else:
		all_but_last, last = split(n)
		return luhn_sum_double(all_but_last) + last
def luhn_sum_double(n):
	all_but_last, last = split(n)
	luhn_digit = sum_digits(2 * last)
	if n < 10:
		return luhn_digit
	else:
		return luhn_sum(all_but_last) + luhn_digit

```

## Recursion and Iteration
```Python
def sum_digits_iter(n):
	digit_sum = 0
	while n > 0:
		n, last = split(n)
		digit_sum = digit_sum +last
	return digit_sum
```

# Lecture ? Tree Recursion
##  Order of Recursive Calls
<mark style="background: #FFF3A3A6;">cascade function</mark>
```python
def cascade(n):
	if n < 10:
		print(n)
	else:
		print(n)
		cascade(n // 10)
		print(n)
print(cascade(12345))
```

```python
def cascade(n):
	print(n)
	if n >= 10:
		cascade(n//10)
		print(n)
print(cascade(12345))
```
## Example: Inverse Cascade
```python
'''
1
12
123
1234
123
12
1
'''
def inverse_cascade(n):
	grow(n)
	print(n)
	shrink(n)
def f_the_g(f,g,n):
	if n:
		f(n)
		g(n)
grow = lambda n: f_then_g(grow,print,n//10)
shrink = lambda n: f_then_g(print,shrink,n//10)
```

## Tree Recursion
```python
'''
fibonacci numbers
fib(n): 0, 1, 1, 2, 3, 5, 8, 13, 21 etc.
'''
'''
ucb is one of the project offered by Uc Berkeley.
I have no way to use it.
'''
from ucb import trace

@trace
def fib(n):
	if n == 0:
		return 0
	elif n == 1:
		return 1
	else:
		return fib(n-2) + fib(n-1)
```
## Example: Counting Partitions
![[Pasted image 20250305221056.png]]

Tree recursion often involves exploring different choices.

```python
def count_partitions(n,m):
	if n == 0:
		return 1
	elif n < 0:
		return 0
	elif m == 0:
		return 0
	else:
		with_m = count_partitions(n-m,m)
		without_m = count_partitions(n,m-1)
		return with_m + without_m
```

# Lecture ? Sequences
## Lists
```python
digits = [1,8,2,8]
digits = [2//2,2+2+2+2,2,2*2]
# they are the same

len(digits) # equals 4
digits[3] # equals 8
getitem(digits,3) # equals 8

[2,7] + digits * 2
add([2,7],mul(digits,2))
# they are the same
# equals [2,7,1,8,2,8,1,8,2,8]

pairs = [ [10,20] , [30,40] ]
pairs[1] # equals [30,40]
pairs[1][0] # equals 30
```
## Containers
```python
digits = [1,8,2,8]
1 in digits # True
5 in digits # False
'1' in digits # False
[1,8] in digits # False
[1,2] in [3,[1,2],4] # True
```
`in` just goes element by element and sees whether it's equal to the element you're looking for.
## For Statements
## Ranges
## List Comprehensions
## Lists, Slices, & Recursion