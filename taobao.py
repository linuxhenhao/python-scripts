# -*- coding: utf8 -*-
import httplib, ssl, urllib, cookielib,urllib2,os,threading,pickle,time
from BeautifulSoup import BeautifulSoup

class auth(object):
	host='login.taobao.com'
	url='https://'+host+'/member/login.jhtml'
	postData={
		'CtrlVersion':'1,0,0,7',
		'TPL_checkcode':'',
		'TPL_password':'3DES_2_000000000000000000000000000000_4D2DCBF2500F13D20544A7780FAF5F12',
		'TPL_redirect_url':'',
		'TPL_username':'diwang90',
		'callback':'',
		'css_style':'',
		'fc':'default',
		'from':'tb',
		'from_encoding':'',
		'full_redirect':'',
		'guf':'',
		'gvfdcname':'10',
		'gvfdcre':'',
		'isIgnore':'',
		'llnick':'',
		'loginType':'3',
		'loginsite':'0',
		'minipara':'',
		'minititle':'',
		'naviVer':'firefox|23',
		'need_check_code':'',
		'need_sign':'',
		'need_user_id':'',
		'newlogin':'0',
		'not_duplite_str':'',
		'osVer':'',
		'oslanguage':'zh-CN',
		'popid':'',
		'poy':'',
		'pstrong':'3',
		'sign':'',
		'sr':'1366*768',
		'style':'default',
		'sub':'',
		'support':'000001',
		'tid':'XOR_1_000000000000000000000000000000_63584752360A7E7879010170',
		'ua':'068u5ObXObBitH2MRY+xNzEXDS85HzknNTzKfM=|uKBnf0c/Zw8Xn7c/Z39XL/U=|uZFW7MuiORVOJd5SdbKVvYWiZUKLEPunKwzWDA==|voZB+5O7fKuzdGxUDATDq9OLTFRsBGyr07sz9OzUvNQTawOLUYs=|vzfw1/Aq|vCTjxOM5|vaW9esDnbCBsYFz0A/Q/xL8kzyhkf4SvtE+ok2izRJ/EHzRvQ7R/hP9kj2jDSATfFDP00/Qu9A==|sqqCRWKpUimyWX6k|s6sz9E5Ggakheb6WUXZ+JgHbAQ==|sNgfpYIr0ZuRWKJ5gqky+aJYQGeguNAXH9jwaCD6IA==|sdkepIMq0JqQWaOpItkyaVCr4LtBWX65ockOBsH50ckTyQ==|tt4Zo4Qt152XXqSuJd41bles57xGXnm+ps4JAcb+tv4k/g==|t6+nYEf9tY3l7dUS2P/n36ef568nf3cPZ/93u7NUbAQcJExUHHRMVFwEjPTc9KxmQYaeRGO5|tKyUU+nOB5x3K6egmH9nb4iAp2BHjmft6vLqLQXC6uLKDSW9pYJYgg==|td0aoIcu1J6UXaetJt02bVSv5L9FXXq9pc0KAsVdNb1nvQ==|qsIFv5gxy4GLQriyOcIpckuw+6BaQmWiutIVHdpCylKIUg==|q/M0jqkA+sCct2z3u4HN1poBOh3aYPjwmF93D3etamKlgqViSnJqUirwKg==|qNAXrYoj2eO/lE/UmKLu9bkiGT754SYONi5W3gTe|qeHp4SYu6cEGbqnByQ52HtnB2YFGXmYe2eG5gUZuFtH5kVZ+JuFp4SY+Zg7J4ckOJj75Yaaetmw=',
		'umto':'Tf78eaf893a87967c68ad2ae814c3aa8b'
			}
	def __init__(self,user,password,cookiename="cookie"):
		self.cj=cookielib.LWPCookieJar(cookiename)
		self.opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(self.cj))
		self.user=user
		self.password=password
		if(os.path.exists(cookiename)):
			self.cj.load(cookiename,ignore_discard=True,ignore_expires=True)
			url_page=self.url_dir+'mainstudent.jsp'
			page=self.opener.open(url_page)
			soup=BeautifulSoup(page)
			span=soup.find('span')
			if(span==None): #cookie alivedead
				return
		self.login(user,password)	
			

	def login(self,user,password):
		url=self.host+'/MultiLanguage/lesson/teacher/loginteacher.jsp';
		user=user
		password=password
		submit1_value='%B5%C7%C2%BC';

		postdata=urllib.urlencode({"userid":user,"userpass":password});

		postdata+='&submit1=%B5%C7%C2%BC'

		login_r =self.opener.open('https://'+url,postdata)
		self.cj.save(ignore_discard=True,ignore_expires=True)

class courseDownload(auth):
	lessons=[]

	def GetCourseList(self):
		url_page1=self.url_dir+'MyCourse.jsp?typepage=1'
		url_page2=self.url_dir+'MyCourse.jsp?typepage=2'
		page1=self.opener.open(url_page1).read()
		page2=self.opener.open(url_page2).read()

		self.__GetCourseList(page1)
		self.__GetCourseList(page2)
		return self.lessons

	def __GetCourseList(self,page):
		soup=BeautifulSoup(page)
		init_time=''
		i=0;
		for tr in soup.findAll('tr'):
			for attr in tr.attrs:
				if((attr[0]=='class')and(attr[1]=='info_tr'or attr[1]=='info_tr2')):
					lesson=tr.find('a')
					url=lesson.attrs[0][1]
					CourseId=url[url.find('=')+1:]
					CourseName=lesson.contents[0]
					CourseTime=CourseName[CourseName.rfind('(')+1:CourseName.rfind(')')]
					CourseName=lesson.text
					CourseName=CourseName[:CourseName.rfind('(')]
					if(init_time!=CourseTime):
						if(init_time):
							i+=1
						self.lessons.append((CourseTime,list()))
						init_time=CourseTime
					self.lessons[i][1].append([CourseId,CourseName])

class GetCourseFile(auth):
	Cid=''
	FileList=[]
	def __init__(self,Cid,user,password):
		self.Cid=Cid	
		super(GetCourseFile,self).__init__(user,password)

	def GetFileList(self):
		url=self.url_dir+'/download.jsp?course_id='+self.Cid
		page=self.opener.open(url)
		soup=BeautifulSoup(page)
		self.FileList=[] #reinit FileList
		for tr in soup.findAll('tr'):
			for attr in tr.attrs:
				if((attr[0]=='class')and(attr[1]=='tr1'or attr[1]=='tr2')):
					tds=tr.findAll('td')
					file_info=tds[1].find('a')
					fileurl=file_info.attrs[1][1]
					path_start=fileurl.find("filePath=")
					course_start=fileurl.find("course_id=")
					file_path=fileurl[path_start+9:course_start-1]
					file_id=fileurl[fileurl.find("file_id=")+8:]
					file_comments=tds[2].text
					self.FileList.append([file_id,file_path,file_comments])
		return self.FileList

class GenTable(auth):
	tableName=''
	Terms=[]
	def __init__(self,user,password,tableName):
		super(GenTable,self).__init__(user,password)	
		self.tableName=tableName
		if(os.path.exists(tableName)):
			f=open(tableName,'r')
			self.Terms=pickle.load(f)
			f.close()
	
	def getTable(self):
		TermsGen=courseDownload(self.user,self.password)
		if(not os.path.exists(self.tableName)):
			f=open(self.tableName,'w')
			self.Terms=TermsGen.GetCourseList()
			pickle.dump(self.Terms,f)
			f.close()
		else:
			f=open(self.tableName,'r')
			self.Terms=pickle.load(f)
			f.close()
		try:
			for i in range(0,len(self.Terms)):
				for j in range(0,len(self.Terms[i][1])):
					self.Terms[i][1][j][2]  #Terms[i][1][j][2] judge course's files is gotten
		except:
				print i,j

		for k in range(i,len(self.Terms)):
			for l in range(j,len(self.Terms[k][1])):  #content os term,course list
				filesGen=GetCourseFile(self.Terms[k][1][l][0],self.user,self.password)
				files=filesGen.GetFileList()
				self.Terms[k][1][l].append(files)
				#Terms[i][1][j][2]   means filelist
				f=open(self.tableName,'w')
				pickle.dump(self.Terms,f)
				f.close()
				print self.Terms[k][1][l][1]

		return self.Terms
		
class downloadfile(auth):
	cid=''
	fid=''
	fpath=''
	def __init__(self,cid,fid,fpath,user,password):
		self.cid=cid
		self.fid=fid
		self.fpath=fpath
		super(downloadfile,self).__init__(user,password)

	def download(self):
		down_url='http://'+self.host+'/uploadFile/downloadFile_student.jsp?module_id=322&filePath='+self.fpath+'&course_id='+self.cid+'&file_id='+self.fid
		result=self.opener.open(down_url)
		try:
			int(result.headers.value()[0])
		except:
			self.login(self.user,self.password)
			result=self.opener.open(down_url)
		return result

class thread_download(downloadfile,threading.Thread):
	dirname=''
	threadnum=0
	CourseFiles=[]
	StatuFile=''
	Terms=[]
	def __init__(self,cid,CourseFiles,SaveDir,StatuFile,user,password,Terms):	
		threading.Thread.__init__(self)
		downloadfile.__init__(self,cid,CourseFiles[0],CourseFiles[1],user,password)
		self.dirname=SaveDir
		self.CourseFiles=CourseFiles
		self.StatuFile=StatuFile
		self.Terms=Terms
		thread_download.threadnum+=1
	def run(self):
		result=self.download()
		header=result.headers.values()
		length=int(header[0]) #header[0] value is content-length
		header=header[1]  #header[1] value is content-dispostion
		filename=header[header.find('filename=')+10:-1]
		filename=filename.decode('GBK').encode('utf-8')
		FullName=self.dirname+'/'+filename
		if(os.path.exists(FullName)):
			FileLength=os.path.getsize(FullName)
			if(FileLength==length):
				print 'already downloaded'
				thread_download.threadnum-=1
				return 
			else:
				req=urllib2.Request(result.url)
				StartBytes=str(FileLength+1)
				req.add_header('Range','bytes='+StartBytes+'-')
				result=self.opener.open(req)
				f=open(FullName,'a')
		else:
			f=open(FullName,'wb')
		data=result.read(1024)
		i=0
		try:
			if(self.CourseFiles[3]==1):
				thread_download.threadnum-=1
				print 'marked as downloaded'
				return
		except:  #if no 1
				print 'downloading',filename
				while(data):
					if(i==500):
						print 'downloading',filename
					f.write(data)
					data=result.read(1024)
				f.close()
				print 'downloaded',filename
				self.CourseFiles.append(1)
				f=open(StatuFile,'w')
				pickle.dump(self.Terms,f)
				f.close()
				thread_download.threadnum-=1

class Downloader(auth):
	Terms=[]
	MaxThreads=0
	StatuFile=''
	DestDir=''
	def __init__(self,user,password,table,threads,DestDir,StatuFile):
		super(Downloader,self).__init__(user,password)
		self.Terms=table
		self.MaxThreads=threads
		self.StatuFile=StatuFile
		self.DestDir=DestDir
		import sys
		reload(sys)
		sys.setdefaultencoding('utf-8')

	def download(self):
		try:
			for i in range(0,len(self.Terms)):
				for j in range(0,len(self.Terms[i][1])):
					for k in range(0,len(self.Terms[i][1][j][2])):
						self.Terms[i][1][j][2][k][3]  
		except:
				print i,j,k

		for u in range(i,len(self.Terms)):
			TermName=self.Terms[u][0]
			if((int(len(self.Terms[u][1]))==1 and int(len(self.Terms[u][1][0][2]))==0 ) or len(self.Terms[u][1])==0 ):
				print 'no lessons'
				continue
			else:
				if(not os.path.exists(TermName)):
					os.mkdir(TermName)
			for v in range(j,len(self.Terms[u][1])):
				print self.Terms[u][1][v][1]
				CourseInfo=self.Terms[u][1][v] #到课的级别
				CourseFiles=CourseInfo[2]
				
				if(not len(CourseFiles)): #如果课程没有课件
					continue
				CourseName=CourseInfo[1]

				path=TermName+'/'+CourseName
				if(not os.path.exists(path)):
					os.mkdir(path)

				for n in range(0,len(CourseFiles)):
					print CourseFiles[n][2]
					DownThread=thread_download(CourseInfo[0],CourseFiles[n],self.DestDir+'/'+path,self.StatuFile,self.user,self.password,self.Terms)
					DownThread.start()
					while(thread_download.threadnum>=self.MaxThreads):
						time.sleep(1)

if __name__ == '__main__':
	user='2009011973'
	password='hy901014'
	StatuFile='table'
	maxThreads=10
	downloadDir='./'
	tableGen=GenTable(user,password,StatuFile)
	table=tableGen.getTable()
	downloader=Downloader(user,password,table,maxThreads,downloadDir,StatuFile)
	downloader.download()
	
