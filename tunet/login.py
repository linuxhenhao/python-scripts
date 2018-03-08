#!/usr/bin/env python
import sys,urllib2,urllib,md5,time
import SocketServer,threading
import os,re

class manageLogin(object):
    '''
    Class used to manage login action,can do login/logout,check statu
    '''
    username=None
    password=None
    def __init__(self,userName="",passWord=""):
        if(manageLogin.username==None and userName!=""):
            manageLogin.username=userName
            manageLogin.password=md5.new(passWord).hexdigest();

        self.topost="username="+self.username+"&password="+self.password+"&drop=0&type=1&n=100" 
        self.url='http://net.tsinghua.edu.cn'
        
    def login(self):
	url=self.url+'/cgi-bin/do_login'
	req=urllib2.Request(url)
	fd=urllib2.urlopen(req,self.topost)
        return self.__output(fd)

    def logout(self):
        url=self.url+'/cgi-bin/do_logout'
        req=urllib2.Request(url)
        fd=urllib2.urlopen(req)
        return self.__output(fd)

    def statu(self):
        url=self.url+'/cgi-bin/do_login'
        post='action=check_online'
        req=urllib2.Request(url)
        fd=urllib2.urlopen(req,post)
        return self.__output(fd)

    def __output(self,fd):
	return fd.read()+'\n'


class Listener(SocketServer.TCPServer,threading.Thread):
    """ 
    this is used to listen for remote control,include check login status,
    login,logout
    """
    def __init__(self,serverAdress,controler,address_family=SocketServer.socket.AF_INET):
        self.address_family=address_family
        self.allow_reuse_address=True
        SocketServer.TCPServer.__init__(self,serverAdress,controler)
        threading.Thread.__init__(self)
        self.setDaemon(True)

    def finish_request(self,request,client_address):
        controler=self.RequestHandlerClass(listener=self)
        controler.handleRequest(request)

    def run(self):
        self.serve_forever()

class Controler(manageLogin):
    '''deal with the request'''

    def __init__(self,username="",password="",listener=None):
        '''use login manager(the class manageLogin) to handleRequest'''
        manageLogin.__init__(self,username,password)
        if(listener!=None):
            self.listener=listener

    def handleRequest(self,request):
        self.sock=request       
        data=self.sock.recv(1024)
        splitedData=data.split("\r\n")[0]
        requestString=splitedData.split()
        if(requestString[0].upper()=='GET'):
          commands=requestString[1][1:]
          if(len(commands)!=0 and commands.find("=")!=-1):
            self.commandsDict=dict(l.split("=") for l in commands.split("&"))
            if(self.commandsDict['print']==time.strftime("%H%M",time.localtime(time.time()))+'debian'):
                if(self.commandsDict['action']=='killServer'):
                    self.sock.send(self.header())
                    self.sock.send('killing server')
                    self.doAction('logout')
                    os.popen('kill -9 '+str(os.getpid())) 
                else:
                    result=self.doAction(self.commandsDict['action'])
                    self.sock.send(self.header())
                    self.sock.send(result)
            else:
                self.sock.send(self.header())
                self.sock.send("print not ok"+time.strftime("%H%M",time.localtime(time.time()))+'debian')
          else:
                self.sock.send(self.header())
                self.sock.send(self.page())
        self.listener.shutdown_request(self.sock)
        print "request ended\n"

    def header(self):
        """return the http header strin"""
        return "HTTP/1.1 200 OK\r\n\r\n"

    def page(self):
        """return the page part of a reponse"""
        return "<p><font size=20>it works<p>"

    def doAction(self,action):
        if(action=="login"):
            result=self.login()
        elif(action=="logout"):
            result=self.logout()
        elif(action=="check"):
            result=self.statu()
        else:
            result="unknow string"
        return result

class userDetecter(object):
    def __init__(self):
        self.searchEngine=re.compile('\d+-\d+-\d+ \d+:\d+')
    def detect(self):
        logined=os.popen('who -u').readlines()
        self.lastlogined=self.newestLoginedTime(logined)
        while True:
            logined=os.popen('who -u').readlines()
            newLogined=self.newestLoginedTime(logined)
            if(newLogined>self.lastlogined):
                print("new logined\n")
                return True
    def newestLoginedTime(self,loginedList):
        newestTime="0"
        for i in loginedList:
            time=self.searchEngine.search(i).group()
            if(newestTime<time):
                newestTime=time
        return newestTime


class threadDetector(threading.Thread):
    def __init__(self,mainPid,controler):
        threading.Thread.__init__(self)
        self.mainPid=mainPid
        self.controler=controler
        self.setDaemon(True)

    def run(self):
        detector=userDetecter()
        if(detector.detect()):
            print("close server")
            self.controler.doAction('logout')
            os.popen('kill -9 '+str(self.mainPid)) 

if __name__== "__main__":
    if (len(sys.argv[1:])!=4):
        print("Usage: login.py -n username -p password")
        exit()
    else:
        if(sys.argv[1]=="-n" and sys.argv[3]=="-p"):
            username=sys.argv[2]
            passW=sys.argv[4]
        elif(sys.argv[3]=="-n" and sys.argv[1]=="-p"):
            username=sys.argv[4]
            passW=sys.argv[2]
        else:
            print("Usage: login.py -n username -p password")
            exit()
    port=8888
    inited=False
    while not inited:
        try:
            listener6=Listener(('',port+1),Controler,SocketServer.socket.AF_INET6)
            listener=Listener(('',port),Controler)
            inited=True
        except Exception,e:
            port+=1
            print(e,"port now:"+str(port))
    controler=Controler(username,passW)
    threadDaemon=threadDetector(os.getpid(),controler)
    threadDaemon.start()
    listener.start()
    listener6.serve_forever()

