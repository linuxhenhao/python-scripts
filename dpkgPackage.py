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



def get_dict_by_lines(lines):
    result_dict={"packages":list(),"datetimes":list(),"versions":list()}
    for line in lines:
        items=line.split(" ")
        datetime=datetime2sec(items[0]+" "+items[1])
        package=items[4]
        version=items[5].strip()
        try:
            index=result_dict['packages'].index(package)
            if(result_dict['datetimes'][index]<=datetime):
                result_dict['datetimes'][index]=datetime
                result_dict['versions'][index]=version
        except:
            dict_item_add(result_dict,package,datetime,version=version)

    return result_dict

def get_installed_packages(lines):
    filter_trigproc={'packages':list(),'datetimes':list(),'versions':list()}
    filter_upgrade={'packages':list(),'datetimes':list(),'versionChange':list()}
    result_dict={"state":list(),"packages":list(),"datetimes":list(),"versions":list()}
    for line in lines:
        items=line.split(" ")
        datetime=datetime2sec(items[0]+" "+items[1])
        if(items[2]=="status"): #installed packages,should filt before put in quene
            package=items[4]
            version=items[5].strip()
            try:
                index=filter_trigproc['packages'].index(package)
                #found in trigproc filter
                if(datetime-filter_trigproc['datetimes'][index]<6000  and \
                        version==filter_trigproc['versions'][index]):#6000s 以内安装 且版本匹配
                    dict_item_remove(filter_trigproc,index)
                    continue
            except ValueError:
                try:
                    index=filter_upgrade['packages'].index(package)
                    #found in upgrade packages
                    if(datetime-filter_upgrade['datetimes'][index]<6000  and \
                        version==filter_upgrade['versionChange'][index][1]):#6000s 以内安装 且版本匹配
                        filter_upgrade['packages'].pop(index)
                        filter_upgrade['datetimes'].pop(index)
                        filter_upgrade['versionChange'].pop(index)
                        dict_item_add(result_dict,package,datetime,version,state="upgrade")
                except:#not in filters,new package,also can be the same package same version
#check if duplicated before insert
                    try:
                        index=result_dict['packages'].index(package)
                        result_dict['versions'][index]=version
                        result_dict['datetimes'][index]=datetime
                    except:
                        #really new package
                        dict_item_add(result_dict,package,datetime,version,state="new")
        elif(items[2]=="upgrade"):
            package=items[3]
            version_old=items[4].strip()
            version_new=items[5].strip()
#add to filter
            filter_upgrade['packages'].append(package)
            filter_upgrade['datetimes'].append(datetime)
            filter_upgrade['versionChange'].append([version_old,version_new])
        elif(items[2]=="trigproc"):
            package=items[3].strip()
            version=items[4].strip()
            dict_item_add(filter_trigproc,package,datetime,version)
    return result_dict



log_file="/var/log/dpkg.log"

installed_results=os.popen("grep -E '(\ installed|trigproc|upgrade)' "+log_file)
removed_results=os.popen("grep \ not-installed "+log_file)

installed_lines=installed_results.readlines()
removed_lines=removed_results.readlines()

installed_packages_dict=get_installed_packages(installed_lines)
removed_packages_dict=get_dict_by_lines(removed_lines)

#debug
dict_count=len(installed_packages_dict['packages'])
for i in range(dict_count):
    if(installed_packages_dict['packages'][i].find("linux-modules-4.2-rc7")!=-1):
        print("DEBUG"+installed_packages_dict['packages'][i],installed_packages_dict['versions'][i],installed_packages_dict['datetimes'][i])
#end debug
removed_index=-1
for removed_packages_name in removed_packages_dict['packages']:
    removed_index+=1
#debug
    if(removed_packages_name.find("linux-modules-4.2")!=-1):
        print("DEBUG remove",removed_packages_dict['packages'][removed_index],removed_packages_dict['versions'][removed_index],removed_packages_dict['datetimes'][removed_index])
#end debug
    try:
        index=installed_packages_dict['packages'].index(removed_packages_name)
        if(removed_packages_dict['datetimes'][removed_index]>=installed_packages_dict['datetimes'][index]):
#removed datetime > datetime
            dict_item_remove(installed_packages_dict,index,state=True)
    except:
        print("removed package "+removed_packages_name+" not found in installed_packages_list")

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

installed_packages_list.sort(cmp=compare_package_line_by_date)



count=len(installed_packages_list)
print installed_packages_list[0][0],installed_packages_list[0][1]
for i in range(count-1):
    t1=installed_packages_list[i][2]
    t2=installed_packages_list[i+1][2]
    if(t2-t1>600):
        print('\n')
    print installed_packages_list[i+1][0],installed_packages_list[i+1][1]


