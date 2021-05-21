---
author: [padawanr0k]
title: python에서의 정렬
date:  2020-11-25
tags: [algorithm]
keyword: [파이썬정렬, python sort]
---
- 프로그래머스에서 [베스트앨범](https://programmers.co.kr/learn/courses/30/lessons/42579) 문제를 풀다가 찾아보게 되었다.


# 간단한 정렬
```python
nums = [4,3,2,1,5]
nums.sort()
nums
>> [1,2,3,4,5]
```
- 원본 데이터를 오름차순으로 정렬시킨다.
- 리스트가 1차원이면서 원소가 primitive한 값일때만 제대로 정렬되는듯 하다.

# 특정 인덱스를 기준으로 정렬
```python
nums = [['jim', 4],['kim', 3],['tom', 2],['bill', 1],['lee', 5]]
nums.sort(key=lambda x:x[1]) # 숫자를 기준으로 정렬
nums
>> [['bill', 1], ['tom', 2], ['kim', 3], ['jim', 4], ['lee', 5]]
```

```python
from operator import itemgetter

nums = [['jim', 4],['kim', 3],['tom', 2],['bill', 1],['lee', 5]]
nums.sort(key=itemgetter(2)) # 같은 역할을한다.
nums
>> [['bill', 1], ['tom', 2], ['kim', 3], ['jim', 4], ['lee', 5]]
```


# 특정 키값을 기준으로 정렬
```python
nums = [{'name': 'jim', 'index': 4},{'name': 'kim', 'index': 3},{'name': 'tom', 'index': 2},{'name': 'bill','index':  1},{'name': 'lee', 'index': 5}]
nums.sort(key=lambda x: x['name'])# 기준으로 삼고 싶은 어트리뷰트의 이름을 넣는다.
nums
>> [{'name': 'bill','index':  1}, {'name': 'tom', 'index': 2}, {'name': 'kim', 'index': 3}, {'name': 'jim', 'index': 4}, {'name': 'lee', 'index': 5}]
```

```python
from operator import attrgetter

nums = [{'name': 'jim', 'index': 4},{'name': 'kim', 'index': 3},{'name': 'tom', 'index': 2},{'name': 'bill','index':  1},{'name': 'lee', 'index': 5}]

nums.sort(key=attrgetter('name')) # 기준으로 삼고 싶은 어트리뷰트의 이름을 넣는다.
nums
>> [{'name': 'bill','index':  1}, {'name': 'tom', 'index': 2}, {'name': 'kim', 'index': 3}, {'name': 'jim', 'index': 4}, {'name': 'lee', 'index': 5}]
```

# 오름차순과 내림차순
```python
nums = [4,3,2,1,5]
nums.sort(reverse=True) # reverse 옵션이 True 인 경우, 내림차순으로 정렬된다.
nums
>> [5,4,3,2,1]
```

# 정렬을 2가지 이상의 기준으로 하고싶을 때
```python
l = [(2, 3), (3, 4), (2, 4)]
l.sort(key = lambda x: (-x[0], -x[1]) )
print(l)
l.sort(key = lambda x: (x[0], -x[1]) )
print(l)

>> [(3, 4), (2, 4), (2, 3)] # 각 원소의 0번째 인덱스를 기준으로 내림차순으로 정렬한 후 1번째 인덱스를 기준으로 내림차순하여 2차정렬
>> [(2, 4), (2, 3), (3, 4)] # 각 원소의 0번째 인덱스를 기준으로 오름차순으로 정렬한 후, 1번째 인덱스를 기준으로 내림차순하여 2차정렬
```


```python
class Student:
    def __init__(self, name, grade, age):
        self.name = name
        self.grade = grade
        self.age = age
    def __repr__(self):
        return repr((self.name, self.grade, self.age))
>>>
student_objects = [
    Student('john', 'A', 15),
    Student('jane', 'B', 12),
    Student('dave', 'B', 10),
]

s = sorted(student_objects, key=attrgetter('age'))     # age 어트리뷰트롤 오름차순으로 정렬한 후
sorted(s, key=attrgetter('grade'), reverse=True)       # grade 어트리뷰트를 기준으로 내림차순 2차 정렬
[('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]
```

### 참조
- https://docs.python.org/ko/3/howto/sorting.html
- https://stackoverflow.com/questions/11850425/custom-python-list-sorting/64329277