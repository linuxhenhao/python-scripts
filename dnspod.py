#!/usr/bin/env python
# -*- coding: utf8 -*-
import urllib,urllib2,socket,time,httplib

class ddns():
    def __init__(self):
        self.conn=httplib.HTTPConnection('192.168.1.1')
        self.password='ubuntu'
        self.session_id='1233sakljfweadl'

    def session_id_gen(self,input1,input2,input3):
         return urllib.quote(self.security_encode(input1,input2,input3))


    def security_encode(self,input1,input2,input3):
            dictionary = input3;
            output = "";
            cl = 0xBB
            cr = 0xBB

            len1 = len(input1);
            len2 = len(input2);
            lenDict = len(dictionary);
            lenth = max(len1, len2);

            for index in range(0,lenth):
                cl=0xBB
                cr=0xBB
                if (index >= len1):
                            cr = ord(input2[index]);
                else:
                    if (index >= len2):
                            cl = ord(input1[index]);
                    else:
                            cl = ord(input1[index]);
                            cr = ord(input2[index]);

                output += dictionary[(cl ^ cr)%lenDict];

            return output;

    def org_auth_pwd(self,password):
        strDe = "RDpbLfCPsJZ7fiv"
        dic = "yLwVl0zKqws7LgKPRQ84Mdt708T1qQ3Ha7xv3H7NyU84p21BriUWBU43odz3iP4rBL3cD02KZciXTysVXiV8ngg6vL48rPJyAUw0HurW20xqxv9aYb4M9wK1Ae0wlro510qXeU07kV57fQMc8L6aLgMLwygtc0F10a0Dg70TOoouyFhdysuRMO51yY5ZlOZZLEal1h0t9YQW0Ko7oBwmCAHoic4HYbUyVeU3sfQ1xtXcPcf1aT303wAQhv66qzW"
        return self.security_encode(password,strDe,dic)
        
    def authorization(self):
        conn=self.conn
        conn.request('POST','/?code=2&async=1&id='+self.session_id,'23')
        response=conn.getresponse()

        if(response.status==200):
            return self.session_id

        results=response.read().split('\r\n') #the results list for auth
        pwd=self.org_auth_pwd(self.password)  
        session_id=self.session_id_gen(results[3],pwd,results[4])
        conn.request('POST',"/?code=7&async=0&id="+session_id,'')
        res=conn.getresponse()
        if(res.status==401):
            print 'auth error'
            exit()
        return session_id;


    def get_ip(self):
        return self.get_ip_from_router()
        

    def get_ip_from_router(self):
        conn=self.conn
        session_id=self.authorization()
        self.session_id=session_id
        conn.request('POST','/?code=2&async=1&id='+session_id,'23')
        res=conn.getresponse()
        if res.status==200:
            data=res.read()
            self.conn.close()
        else:
            session_id=self.authorization()
            conn.request('POST','/?code=2&async=1&id='+session_id,'23')
            res=conn.getresponse()
            if res.status==200:
                data=res.read()
                self.conn.close()
            else:
                print "can't auth,exit"
                exit()
        self.data=data
        ip=data.split('\r\n')[2].split(' ')[1]
        return ip



        

    def get_ip_from_ip138():
        html_fd=urllib.urlopen('http://20140507.ip138.com/ic.asp')
        page=html_fd.read()
        start=page.find('[')
        end = page.find(']')
        return page[start+1:end]

    def get_ns_ip(self,ns_name):
        return socket.gethostbyname(ns_name)

    def ddns(self,ip):
        server_url='https://dnsapi.cn/Record.Ddns'
        dic=dict((['login_email','diwang90@gmail.com'],
            ['login_password','Yk6zIZuy'],
            ['format','json'],
            ['domain_id','1627919'],
            ['record_id','75183567'],
            ['sub_domain','work'],
            ['record_type','A'],
            ['record_line','默认'],
            ['value',ip]))

        data=urllib.urlencode(dic)
        result=urllib.urlopen(server_url,data).read()
        print result



#get_ip_from_router()
if __name__ == '__main__':
    author=ddns()
    while True:
        ip=author.get_ip()
        ns_ip=author.get_ns_ip('work.diwang90.tk')
        if(ip!=ns_ip):
            author.ddns(ip)
        time.sleep(600)
