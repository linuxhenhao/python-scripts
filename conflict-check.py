import  os
dir=input("Dir to check conflics\n")

if(!os.path.isdir(dir)):
    print(dir+" Not a directory")
    exit()



