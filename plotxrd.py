#!/usr/bin/env python

import os,sys
import numpy as np
import matplotlib.pylab as plt

filename='4-15-0-100.USR'


def pltinit():
	plt.grid()
	plt.axis(xmin=20,xmax=60)
	plt.ylabel('Intensity(cps)')
	plt.xlabel(r'2$\theta$(deg)')

def plot(filename):
	figname=filename[:filename.find(".USR")]+'.png'
	data=np.loadtxt(filename)
	print 'ploting',figname
	plt.plot(data[:,0],data[:,1])
	plt.savefig(figname)
	plt.clf()

os.chdir(os.getcwd())
files=os.listdir('.')
for i in files:
	if(i.find('.USR')>=0):
		pltinit()
		if(i.find("si")>=0):
			plt.axis(ymax=1000)
		plot(i)
