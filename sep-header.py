#!/usr/bin/env python
import os,sys


filelist=os.listdir(os.getcwd())
for i in filelist:
	if(i.find('USR')>=0):
		file=open(i,'r')
		content=file.read()
		file.close()
		file=open(i,'w')
		lines=content.splitlines()
		if(lines[0].find('FILE')>=0):
			for j in lines[8:]:
				file.write(j)
				file.write('\n')
			f=open('header-'+i[:i.find('.')]+'.txt','w')
			for j in lines[:8]:
				f.write(j)
				f.write('\n')
				header=1
			f.close()
			file.close()
