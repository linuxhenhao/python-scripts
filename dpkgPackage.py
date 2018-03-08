#!/usr/bin/env python
#-*- coding: utf-8 -*-
###################################################
#Using dpkg.log to get what packages are installed
#Because apt.log will miss packages dealed by dpkg
#command
###################################################

import os
import time

#packages that will  be triggered every time
def dict_item_add(dic,package,datetime,version,state=None):
    dic['packages'].append(package)
    dic['datetimes'].append(datetime)
    dic['versions'].append(version)
    if(state!=None):
        dic['state'].append(state)

def dict_item_remove(dic,index,state=None):#remove the index of the dict
    dic['packages'].pop(index)
    dic['datetimes'].pop(index)
    dic['versions'].pop(index)
    if(state!=None):
        dic['state'].pop(index)

def datetime2sec(string):
    t1=time.strptime(string,"%Y-%m-%d %H:%M:%S")
    return time.mktime(t1)
def sec2datetime(sec):
    t=localtime(sec)
    return time.strftime("%Y-%m-%d %H:%M:%S",t)

class Filter:
    def __init__(self,name):
        self.name=name
        if(self.name=='upgrade'):
            self.items={'packages':list(),'datetimes':list(),'versionChange':list()}
        else:
            self.items={'packages':list(),'datetimes':list(),'versions':list()}

    def add_item(self,package,datetime,version):
        index=self.is_in_filter(package,datetime,version)
        if(index!=None):#already in this filter,overwrite
            self.items['datetimes'][index]=datetime
            if(self.name=='upgrade'):
                self.items['versionChange'][index]=version
            else:
                self.items['versions'][index]=version
        else: #not in filter
            self.items['packages'].append(package)
            self.items['datetimes'].append(datetime)
            if(self.name=='upgrade'):
                self.items['versionChange'].append(version)
            else:
                self.items['versions'].append(version)

    def delete_item(self,index):
        self.items['packages'].pop(index)
        self.items['datetimes'].pop(index)
        if(self.name=='upgrade'):
            self.items['versionChange'].pop(index)
        else:
            self.items['versions'].pop(index)

    def index_of_package(self,package_name):
        try:
            index=self.items['packages'].index(package_name)
            return index
        except:
            return None
    def is_in_filter(self,package_name,datetime,version):
        index=self.index_of_package(package_name)
        if(index!=None and datetime-self.items['datetimes'][index]<6000):
            if(self.name=='upgrade'):
                if(self.items['versionChange'][index][1]==version):
                    return index
            else:
                if(self.items['versions'][index]==version):
                    return index
        return None


def get_removed_packages(lines):
    result_dict={"packages":list(),"datetimes":list(),"versions":list()}
    len_of_lines=len(lines)
    gcount=-1
    for line in lines:
        gcount+=1
        items=line.split(" ")
        datetime=datetime2sec(items[0]+" "+items[1])
        if(items[2]=='status'):
            package=items[4]
            version=items[5].strip()
            try:
                index=result_dict['packages'].index(package)
                if(result_dict['datetimes'][index]<=datetime):
                    result_dict['datetimes'][index]=datetime
                    result_dict['versions'][index]=version
            except:
                dict_item_add(result_dict,package,datetime,version=version)
        elif(items[2]=='remove'):#in some conditions,only remove line can be found,no not-installed
#followed,so add it to removed packages dict,too
            if(gcount+1<len_of_lines):
                next_items=lines[gcount+1].split()
                if(next_items[3]!='not-installed'):
                    package=items[3]
                    version=items[4]
                    try:
                        index=result_dict['packages'].index(package)
                        if(result_dict['datetimes'][index]<=datetime):
                            result_dict['datetimes'][index]=datetime
                            result_dict['versions'][index]=version
                    except:
                        dict_item_add(result_dict,package,datetime,version=version)
            else:
                package=items[3]
                version=items[4]
                try:
                    index=result_dict['packages'].index(package)
                    if(result_dict['datetimes'][index]<=datetime):
                        result_dict['datetimes'][index]=datetime
                        result_dict['versions'][index]=version
                except:
                    dict_item_add(result_dict,package,datetime,version=version)



    return result_dict

def get_installed_packages(lines):
    filter_trigproc=Filter('trigproc')
    filter_upgrade=Filter('upgrade')
    filter_remove=Filter('remove')
    #filter_trigproc={'packages':list(),'datetimes':list(),'versions':list()}
    #filter_upgrade={'packages':list(),'datetimes':list(),'versionChange':list()}
    result_dict={"state":list(),"packages":list(),"datetimes":list(),"versions":list()}
    def add_to_result_dict(result_dict,package,datetime,version):
        try:
            index=result_dict['packages'].index(package)
            result_dict['versions'][index]=version
            result_dict['datetimes'][index]=datetime
        except:
            #really new package
            dict_item_add(result_dict,package,datetime,version,state="new")

    len_of_lines=len(lines)
    gcount=-1
    for line in lines:
        gcount+=1
        items=line.split(" ")
        datetime=datetime2sec(items[0]+" "+items[1])
        if(items[2]=="status"): #installed packages,should filt before put in quene
            package=items[4]
            version=items[5].strip()
            index=filter_remove.is_in_filter(package,datetime,version)
            if(index!=None):#in filter remove
                filter_remove.delete_item(index)
                continue
            index=filter_upgrade.is_in_filter(package,datetime,version)
            if(index!=None):#in filter upgrade
                filter_upgrade.delete_item(index)
                dict_item_add(result_dict,package,datetime,version,state="upgrade")
                continue
            index=filter_trigproc.is_in_filter(package,datetime,version)
            if(index!=None):#in filter trigproc
                filter_trigproc.delete_item(index)
                continue
            add_to_result_dict(result_dict,package,datetime,version)
        elif(items[2]=='install'):
            if(gcount+1<len_of_lines):
                next_items=lines[gcount+1].split()
                if(next_items[3]!='installed'):
                    package=items[3]
                    version=items[4]
                    add_to_result_dict(result_dict,package,datetime,version)
            else:
                package=items[3]
                version=items[4]
                add_to_result_dict(result_dict,package,datetime,version)
        elif(items[2]=="upgrade"):
            package=items[3]
            version_old=items[4].strip()
            version_new=items[5].strip()
#add to filter
            filter_upgrade.add_item(package,datetime,(version_old,version_new))
        elif(items[2]=="trigproc"):
            package=items[3].strip()
            version=items[4].strip()
            filter_trigproc.add_item(package,datetime,version)
        elif(items[2]=="remove"):
            package=items[3].strip()
            version=items[4].strip()
            filter_remove.add_item(package,datetime,version)

    return result_dict



log_file="/var/log/dpkg.log"

installed_results=os.popen("grep -Ea '(\ installed|trigproc|upgrade|remove|install)' "+log_file)
removed_results=os.popen("grep -Ea '(\ not-installed|remove)' "+log_file)

installed_lines=installed_results.readlines()
removed_lines=removed_results.readlines()

installed_packages_dict=get_installed_packages(installed_lines)
removed_packages_dict=get_removed_packages(removed_lines)

#debug
dict_count=len(installed_packages_dict['packages'])
for i in range(dict_count):
    if(installed_packages_dict['packages'][i].find("linux-modules-4.2-rc7")!=-1):
        print(("DEBUG"+installed_packages_dict['packages'][i],installed_packages_dict['versions'][i],installed_packages_dict['datetimes'][i]))
#end debug
removed_index=-1
for removed_packages_name in removed_packages_dict['packages']:
    removed_index+=1
#debug
    if(removed_packages_name.find("linux-modules-4.2")!=-1):
        print(("DEBUG remove",removed_packages_dict['packages'][removed_index],removed_packages_dict['versions'][removed_index],removed_packages_dict['datetimes'][removed_index]))
#end debug
    try:
        index=installed_packages_dict['packages'].index(removed_packages_name)
        if(removed_packages_dict['datetimes'][removed_index]>=installed_packages_dict['datetimes'][index]):
#removed datetime > datetime
            dict_item_remove(installed_packages_dict,index,state=True)
    except:
        print(("removed package "+removed_packages_name+" not found in installed_packages_list"))

#dict to list
count=len(installed_packages_dict['packages'])
installed_packages_list=list()
for i in range(count):
    installed_packages_list.append([installed_packages_dict['state'][i],installed_packages_dict['packages'][i],installed_packages_dict['datetimes'][i],installed_packages_dict['versions'][i]])

#now installed packages became the real installed packages in the system now
def compare_package_line_by_date(line1,line2):
    if(line1[2]==line2[2]):
        return 0
    elif(line1[2]>line2[2]):
        return 1
    else:
        return -1

installed_packages_list.sort(key=lambda li: li[2])



count=len(installed_packages_list)
print(installed_packages_list[0][0],installed_packages_list[0][1])
for i in range(count-1):
    t1=installed_packages_list[i][2]
    t2=installed_packages_list[i+1][2]
    if(t2-t1>600):
        print('\n')
    print("{} {}".format(installed_packages_list[i+1][0],installed_packages_list[i+1][1]))


