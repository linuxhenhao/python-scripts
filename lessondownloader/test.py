#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pickle,cookielib

if __name__ == '__main__':
	cookie = cookielib.LWPCookieJar()
	cookie.load('cookie',ignore_discard=True,ignore_expires=True)
	print cookie
