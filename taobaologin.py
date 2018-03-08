#!/usr/bin/env python
import urllib, urllib2, socket, cookielib
import json, re, os,sys
import time, datetime

reload(sys)
sys.setdefaultencoding("utf-8")

# set timeout

timeout = 20

timesleep = 10

socket.setdefaulttimeout(timeout)



httpHandler = urllib2.HTTPHandler()

httpsHandler = urllib2.HTTPSHandler()



# cookie support

cookie = cookielib.CookieJar()

cookie_support= urllib2.HTTPCookieProcessor(cookie)



opener = urllib2.build_opener(cookie_support, httpHandler, httpsHandler)

urllib2.install_opener(opener)



def get_headers():

		headers = {

			"User-Agent":"Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.2.13) Gecko/20101203 Firefox/3.6.13",

			"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",

			"Accept-Language":"zh-cn,zh;q=0.5",

			"Accept-Charset":"GB2312,utf-8;q=0.7,*;q=0.7",

			"Keep-Alive":"115",

			"Connection":"keep-alive"

		}

		return headers



def get_login_data():

		login_data = {

				'TPL_username':u'diwang90'.encode('gbk'),

				'action':'Authenticator',

				'event_submit_do_login':'anything',

				'TPL_redirect_url':'',

				'from':'tb',

				'fc':'2',

				'style':'default',

				'css_style':'',

				'tid':'',

				'support':'000001',

				'CtrlVersion':'1,0,0,7',

				'loginType':'3',

				'minititle':'',

				'minipara':'',

				'pstrong':'3',

				'longLogin':'-1',

				'llnick':'',

				'sign':'',

				'need_sign':'',

				'isIgnore':'',

				'popid':'',

				'callback':'',

				'guf':'',

				'not_duplite_str':'',

				'need_user_id':'',

				'poy':'',

				'gvfdcname':'10',

				'from_encoding':''

				}

		return login_data



def login(source=None):

		url = 'https://login.taobao.com/member/login.jhtml'

		if not source:

			source = urllib2.urlopen(url)

		token_list = source.headers.get('set-cookie').split(';')[3].split('=')[1]

		login_data = get_login_data()

		login_data['_tb_token_'] = token_list if token_list else ''

		login_data['TPL_password'] = 'nyl890806'

		login_data=urllib.urlencode(login_data)

		source = urllib2.Request(url, login_data)

		conn = urllib2.urlopen(source)

		return token_list

if __name__ == '__main__':
	print login()
