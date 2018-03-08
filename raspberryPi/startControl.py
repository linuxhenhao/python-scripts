#!/usr/bin/env python
#-*- coding:utf8 -*-

import os,time

server_path='/media/storage/yuzi/seafile-server-latest'

programs = ['seafile','seahub','dnspod']
programs_path = {'seafile':server_path+'/seafile.sh start',
		'seahub':server_path+'/seahub.sh start',
		'dnspod':'/usr/bin/dnspod.py '}

programs_identify = {'seafile':'seafile-controller',
			'seahub':'manage.py',
			'dnspod':'dnspod.py'}
result=''

def check_program_status(program_name):
	resource=os.popen('ps aux|grep -i '+programs_identify[program_name]+' |wc -l')	
	result=int(resource.read())
	print program_name,result
	if 2 >= result :
		return False
	else:
		return True

def run_program(program_name):
	return os.popen(programs_path[program_name])

def kill_program(program_name):
	return os.popen('killall '+programs_path[program_name])

if __name__ == '__main__':
    while True:
	for program in programs:
		print program
		if check_program_status(program) == False:
			res=run_program(program)
			if program!='dnspod':
				print res.read()
				res.close()
	time.sleep(60)	

