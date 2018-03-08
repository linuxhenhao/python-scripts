#!/usr/bin/env python
# -*- coding: utf8 -*-
import   urllib, cookielib,urllib2,os,time,sys,re
from BeautifulSoup import BeautifulSoup
reload(sys)
sys.setdefaultencoding("utf-8")
class auth(object):
	host='http://emuch.net'
	cookiename="/tmp/cookie"
	def __init__(self,user,password,cookiename=cookiename):
		self.cj=cookielib.LWPCookieJar(cookiename)
		self.opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(self.cj))
		self.user=user
		self.password=password
                if(os.path.exists(cookiename)): 
                    self.cj.load(cookiename,ignore_discard=True,ignore_expires=True)
                    url_page=self.host+'/bbs/logging.php?action=login'
                    page=self.opener.open(url_page)
                    page=page.read()
                    soup=BeautifulSoup(page)
                    span=list()
                    span=soup.findAll('b') #if logined this page has only one 'b'
                    if(len(span)==1):
                            #logined,so return,do not do login action
                            print('already logined')
                            return
		self.login(user,password)	
			

	def login(self,user,password):
		timenow=(int(time.time()))
		login_url=self.host+'/bbs/logging.php?action=login';
		post_url=login_url+'&t='+str(timenow)
		user=user
		password=password
		loginsubmit='%BB%E1%D4%B1%B5%C7%C2%BC'
		
		login_page=self.opener.open(login_url).read()
		soup=BeautifulSoup(login_page)
		form=soup.find('form')
		inputs=form.findAll('input')
		formhash=inputs[0]['value']                      #input[0] refer to formhash
		referer=inputs[1]['value']
		postdata=urllib.urlencode({"formhash":formhash,"referer":referer,"username":user,"password":password,"cookietime":"31536000"});
		postdata+='&loginsubmit='+loginsubmit


		login_r =self.opener.open(post_url,postdata)
		self.cj.save(ignore_discard=True,ignore_expires=True)

	def get_credit(self):
		credit_url=self.host+'/bbs/memcp.php?action=getcredit'
		page_src=self.opener.open(credit_url)
		page=page_src.read()
		soup=BeautifulSoup(page)
		self.soup=soup
		form=soup.find('form')
		inputs=form.findAll('input')

		getmode="1"
		formhash=inputs[0]['value']     #inputs[0] refer to 'formhash'
		message=inputs[3]['value']       #inputs[3] refer to 'message'
		
		creditsubmit="%C1%EC%C8%A1%BA%EC%B0%FC"
		
		postdata=urllib.urlencode({"formhash":formhash,"getmode":getmode,"message":message})
		postdata+='&creditsubmit='+creditsubmit
		result=self.opener.open(credit_url,postdata)
		soup=BeautifulSoup(result.read())
		info=soup.find('b')
		if(info.text.find(u'已经领取了')):
			print('红包已领取过了')
		else:
			print('红包领取成功')
        def click_ads(self):
                clickok_url=self.host+'/bbs/clickok.php?hello='
                indexPageReq=self.opener.open(self.host+'/bbs/index.php')      
                soup=BeautifulSoup(indexPageReq.read())
                self.soup=soup
                scriptTab=soup.findAll('script')
                script=scriptTab[0].text
                clickokHash=re.search(r'=\'(\S+)\'',script)
                clickokHash=clickokHash.groups()[0]
                clickok_url=clickok_url+clickokHash+'&inajax=1'
                result=self.opener.open(clickok_url)
if __name__ == '__main__':
	a=auth('Username','password')
	a.get_credit()
        a.click_ads()
	exit()
