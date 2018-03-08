#!/usr/bin/env python
#-*- coding: utf-8 -*-

import os
import codecs
import bibtexparser as bp
import sys

if(sys.version_info.major==2):
    reload(sys)
    sys.setdefaultencoding("utf-8")

class BibFnameRename:
    def __init__(self,bibFile):
        import re
        bib=open(bibFile)
        self.db=bp.load(bib)
        self.flist=list()
        self._flistGen()

    def _ostrip(self,string):
        '''
        sited=";"
        def __findall(string,match,startIndex,li):
            index=string.find(match)
            if(index!=-1):
                li.append(startIndex+index)
            else:
                return
            if(index+1<len(string)):
                __findall(string[index+1:],match,startIndex+index+1,li)
        li=list()
        __findall(string,"\\",0,li)
        if(len(li)!=0):
            for i in li:
                if(sited.find(string[i+1])==-1):
                    string=string[:i]+"/"+string[i+1:]# i can't be the last char
            return string
        '''
        if(string.find("\\\\")!=-1):
                string=string.replace("\\\\","/")
        return string

    def _flistGen(self,bibDataBase=None,flist=None):
        if(bibDataBase==None or flist==None):
            db=self.db
            flist=self.flist
        else:
            db=bibDataBase
        j=0
        for i in range(len(db.entries)):
            try:
                fpath=db.entries[i]['file']
            except :
                continue
            j=j+1
            #change all dir seperator to /
            fpath=self._ostrip(fpath)
            fpathUnit=[i]
            firstColumn=fpath.find(":")
            lastColumn=fpath.rfind(":")
            #file relative path and name
            fpathUnit.append(self._dealFname(fpath[firstColumn+1:lastColumn]))
            #file external type
            fpathUnit.append(fpath[lastColumn:])
            flist.append(fpathUnit)
    def _dealFname(self,string):
        '''some of the charactors in bib file are spacial char,
        so pluged "\",we delete it because when open or deal with
        the file in file system,we don't need that,such as "\;"
        '''
        return string.replace("\\","")
    def _dealFname4bib(self,string):
        '''corresponding to _dealFname,when writing to bib file ,
        the spacial charactors should add '\'
        '''
        spacials=[';',':']
        for each in spacials:
                string=string.replace(each,"\\"+each)
        return string

    def StringPreProcess(self,string):
        '''
        ignore the latex command and other charactors
        '''
        ignore=['{','}','$',',','.',';']
        replace=["\\\\","/"," "]
        dir(string)
        for each in ignore:
            string=string.replace(each,"")
        for each in replace:
            string=string.replace(each,"_")
        return string

    def getFirstAuthor(self,dbentry):
        authorsList=dbentry['author'].split("and")
        if(authorsList==None):
        #only one author
            return self.StringPreProcess(dbentry['author'])
        return self.StringPreProcess(authorsList[0].strip())

    def getTitle(self,dbentry):
        return self.StringPreProcess(dbentry['title'])

    def getNewFileName(self,db=None,flist=None):
        '''
        db : BibtexDatabase
        flist data structure db.entries index:file relative path:file type
        '''
        if(db==None or flist==None):
            db=self.db
            flist=self.flist
        f=codecs.open("./a.txt","a+","utf-8")
        for i in range(len(flist)):
            #fname get
            fnameStart=flist[i][1].rfind("/")+1
            fnameStop =flist[i][1].rfind(".")
            fname=flist[i][1][fnameStart:fnameStop]
            #fname extern get
            fnameExtern=flist[i][1][fnameStop+1:]
            dbentry=db.entries[flist[i][0]]
            newFname=""
            try:
                year=dbentry['year']
            except:
                print("entry year cannot get")
                newFname=self.getTitle(dbentry)+"_"+self.getFirstAuthor(dbentry)
            if(newFname==""):
                newFname=self.getTitle(dbentry)+'_'+self.getFirstAuthor(dbentry)+"_"+year
            newRelativeFname=flist[i][1][:fnameStart]+newFname+flist[i][1][fnameStop:]
            flist[i].append(newRelativeFname)
            f.write(str(i)+":  ")
            f.write(fname)
            f.write("\t")
            f.write(newRelativeFname)
            f.write("\r\n")
        f.close()

    def renameFile(self,bibFile,mainDir,db=None,flist=None):
        '''renamer's main function after initial ,this function can be used
            to really change the file
        '''
        if(db==None or flist==None):
            db=self.db
            flist=self.flist
        self.getNewFileName(db,flist)
        if(os.path.exists(bibFile)):
                answer=input("file "+bibFile+" already exists,overwrite?(y/n)")
                if(answer.lower()=="y"):
                        os.remove(bibFile)
                else:
                        print("Please change new bibFile name")
                        exit()
        #now we got the flist list each element of the list is anthoer list
        #["entry index","existed relative file path",
        # "file external type","generated new relative file name"]
        pwd=os.getcwd()
        os.chdir(mainDir)
        for eachlist in flist:
                #rename file
                def seperator(string):
                    return string.replace("/",os.sep)
#add some code to think about whether the old file exists,
#if doesn't exists,judge where already renamed to new name,if so ,
#don't need to realy rename file ,only change the file link in the BibDatabase
                oldName=seperator(eachlist[1])
                newName=seperator(eachlist[3])
                if(os.path.exists(oldName)):
                        print(oldName+" to "+newName)
                        os.renames(oldName,newName)
                else:
                #if oldName don't exists,check whether newName already
                #exists,which means rename has been done,but db didn't
                #changed correspondly
                        if(os.path.exists(newName)):
                                print(oldName+" to "+newName)
                                db.entries[eachlist[0]]['file']=u":"+self._dealFname4bib(eachlist[3])+eachlist[2]
                        else:
                                db.entries[eachlist[0]].pop('file')


                #change the db entry's file key's value
                db.entries[eachlist[0]]['file']=u":"+self._dealFname4bib(eachlist[3])+eachlist[2]
        os.chdir(pwd)
        files=codecs.open(bibFile,"a+","utf-8")
        bp.dump(db,files)
        files.close()





def main():
    import sys
    if(len(sys.argv)!=4):
        print("Usage: "+sys.argv[0]+" bibfilename newbibfile mainDirectory")
        exit()
    renamer=BibFnameRename(sys.argv[1])
    renamer.renameFile(sys.argv[2],sys.argv[3])

if __name__ == "__main__":
        main()

