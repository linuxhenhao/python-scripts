#!/usr/bin/env python
#-*- coding: utf-8 -*-

#auto connect to wifi and auto reconnect after disconnected

import os,subprocess
import time

WPA='wpa_supplicant'

class WifiConnecter:
    def __init__(self,interface,wifi_name,wifi_pass,ipaddr,gateway):
        self._interface=interface
        self._wifi_name=wifi_name
        self._wifi_pass=wifi_pass
        self._ip=ipaddr
        self._gateway=gateway
        self._conf_file='/tmp/'+wifi_name+'.conf'
        self._create_conf()
        self.null=open('/dev/null')

    def _create_conf(self):
        file_path=self._conf_file
        if(os.path.exists(file_path)):
            os.remove(file_path)
        conf_file=open(file_path,'w')
        subprocess.check_call(['wpa_passphrase',self._wifi_name,self._wifi_pass],stdout=conf_file)
        conf_file.flush()
        conf_file.close()

    @property
    def interface(self):
        return self._interface
    @property
    def wifi_name(self):
        return self._wifi_name
    @property
    def wifi_pass(self):
        return self._wifi_pass

    def connect(self):
        try:
            subprocess.check_call(['pidof',WPA])
            subprocess.check_call(['killall',WPA])
        finally:
            subprocess.check_call([WPA,'-B','-c',self._conf_file,'-i'+self._interface])
            time.sleep(0.1) #wait for wpa_supplicant
#set ip address and default route
            subprocess.check_call(['ip','link','set',self._interface,'up'])
            subprocess.check_call(['ip','address','replace',self._ip,'dev',self._interface])
            subprocess.check_call(['ip route replace default via',self._gateway,'dev',self._interface])


    def check_connected(self):
        try:
            subprocess.check_call(['ping','-c 5',self._gateway],stdout=self.null)
#ping return non-zero exist only when all packets lost
            return True
        except:
            print('disconnected from '+self._wifi_name)
            return False

if __name__ == '__main__':
    connecter=WifiConnecter('wlan0','helloworld','nizijicai','192.168.168.2/24','192.168.168.1')
    while True:
        if connecter.check_connected():
            time.sleep(5)
            continue
        connecter.connect()
        time.sleep(1)
