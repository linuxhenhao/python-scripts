#!/usr/bin/env python


test='''zhege linux firefox'''

f=file('text.txt','w')
f.write(test)
f.close()

f=file('text.txt')
while True:
		line=f.readline()
		if len(line)==0:
			break
		print(line)
f.close()
