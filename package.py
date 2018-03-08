#!/usr/bin/env python
#-*- code:utf8 -*-
#use this script to get the packages installed by date

import time,re


timeMax='Start-Date: 2015-12-12  24:00:00'
file=open('/var/log/apt/history.log')
#file=open('/home/huangyu/history.log')
lines=file.readlines()
lines.remove('\n')
lineNums=len(lines)

def str2time(str):
	return time.strptime(str,'Start-Date: %Y-%m-%d  %H:%M:%S')

def NextDate(lineNum,filelines):
	while(1):
		lineNum+=1
		if(lineNum>=lineNums):
			return -1
		if(filelines[lineNum].find('Start-Date')!=-1):
			return [filelines[lineNum],lineNum]

def FirstDateLineNum(filelines):
	for i in range(0,lineNums):
		filelines[i].find('Start-Date')
		return i

def GetPackagesRealInstalled(DateStart,DateEnd=timeMax,filelines=None):
	result=GetPackages('3',DateStart,DateEnd,filelines)
	installed=result[0]
	removed=result[1]
	for i in removed:
		if(i!="\n"):
			try:
				installed.remove(i)
			except ValueError,e:
				continue
	return installed

#type: '1' means installed, '2' means removed, '3' means get both of them
def GetPackages(type,DateStart,DateEnd=timeMax,filelines=None):
	installed=list()
	removed=list()
	num=FirstDateLineNum(filelines)
	Date=filelines[num]
	funcDict={'1':installed,'2':removed,'3':bothInstalledRemoved}
	while(Date<DateStart):
		DResult=NextDate(num,filelines)
		if(DResult==-1):
			break
		Date=DResult[0]
		num=DResult[1]
	while(Date<DateEnd):
		if(filelines[num+1].find("Commandline")==-1): #has Commandline line
			data=re.split(' ',filelines[num+1]) #split string
		else:	#no Commandline line
			data=re.split(' ',filelines[num+2]) #split string
		i=1
		while(1):
			if(i>=len(data)):
				break
			if(re.search('amd64|i386',data[i])==None): # ) exists
				del data[i]
			else:
				i+=1


		funcDict[type](data,installed,removed)
		DResult=NextDate(num,filelines)
		if(DResult==-1):
			break
		Date=DResult[0]
		num=DResult[1]
	result=[installed,removed]
	return result


def installed(data,listi,listr):
	if(data[0].upper()=='INSTALL:'):
		for i in data[1:]:
			listi.append(i)
		listi.append("\n")

def removed(data,listi,listr):
	if(data[0].upper()=='REMOVE:' or data[0].upper()=='PURGE:'):
		for i in data[1:]:
			listr.append(i)
		listr.append("\n")

def bothInstalledRemoved(data,listi,listr):
	if(data[0].upper()=='INSTALL:'):
		for i in data[1:]:
			listi.append(i)
		listi.append("\n")
	else:
		if(data[0].upper()=='REMOVE:' or data[0].upper()=='PURGE:'):
			for i in data[1:]:
				listr.append(i)
			listr.append("\n")



if __name__ == '__main__':
	for i in GetPackagesRealInstalled('Start-Date: 2013-01-01  00:07:27',filelines=lines):
		print("%s"%i)
