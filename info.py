# -*- coding: utf8 -*-
import httplib, ssl, socket,urllib, cookielib
host='learn.tsinghua.edu.cn'
url=host+'/MultiLanguage/lesson/teacher/loginteacher.jsp';
user='huangyu'
password='hy901014'
submit1_value='%B5%C7%C2%BC';

postdata=urllib.urlencode({"userid":user,"userpass":password});

postdata+='&submit1=%B5%C7%C2%BC'
conn = httplib.HTTPSConnection(host)

sock = socket.create_connection((conn.host, conn.port), conn.timeout, conn.source_address)

conn.sock = ssl.wrap_socket(sock, conn.key_file, conn.cert_file, ssl_version=ssl.PROTOCOL_TLSv1)

print 'use '+postdata+'to login to '+url
conn.request('POST',url,postdata)


response = conn.getresponse()
print response.getheaders()
print response.read()
