
# coding: utf-8

from tornado import httpclient
from bs4 import BeautifulSoup
from urllib3.util import parse_url
from urllib.parse import urlencode
from http import cookies
from datetime import datetime, timedelta
import re
import logging

logger = logging.getLogger('sxlib-renew-books')
logger.setLevel(logging.DEBUG)


class Relend(object):
    def __init__(self, username, password):
        self._username = username
        self._password = password
        self._client = httpclient.HTTPClient()
        # cookies dict using host as key and SimpleCookie
        # instance as value
        self._cookies = dict()

    def fetch(self, url, data=None):
        '''
        @param dict data: the data dict to be sent using post
        method
        '''
        if(data is None):
            method = 'GET'
            data_body = None
        else:
            method = 'POST'
            data_body = urlencode(data)
        url_items = parse_url(url)
        headers = {
                'Host': url_items.host,
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:57.0)'
                              'Gecko/20100101 Firefox/57.0',
                'Accept': 'text/html,application/xhtml+xml,'
                          'application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'zh-CN;zh;en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive'
                }
        if(url_items.host in self._cookies):
            cookie = self._cookies[url_items.host]
            # the output()'s results is in Set-Cookie: xxxx format
            # but we using http client to fetch data, only xxxx is
            # useful
            headers['Cookie'] = cookie.output(header='', sep=';')
        else:
            cookie = None

        req = httpclient.HTTPRequest(
                url,
                method=method,
                headers=headers,
                body=data_body
                )
        logger.debug('processing request:\r\n{},{}'.format(url, data_body))
        response = self._client.fetch(req)
        if('Set-Cookie' in response.headers):
            if(cookie is None):
                # create cookie instance is not exist
                cookie = cookies.SimpleCookie()

            cookie.load(response.headers['Set-Cookie'])
            self._cookies[url_items.host] = cookie
        return response

    def _findRelendUrl(self):
        response = self.fetch('http://sxlib.org.cn')
        soup = BeautifulSoup(response.body, 'html5lib')
        results = soup.findAll('div', attrs={"class": "home-tool-label"})
        for div in results:
            ablock = div.a
            if(ablock.get_text().strip() == '网上续借'):
                return ablock['href']

    def login_and_get_renewable_list(self):
        login_url = self._findRelendUrl()
        return self._login_and_get_renewable_list(
                login_url, self._username, self._password)

    def _login_and_get_renewable_list(self, login_url, username, password):
        '''
        login to sxlib using username and passwd, get info from login req's
        response
        @param str login_url: the url of the login page
        @param str username
        @param str password
        '''
        response = self.fetch(login_url)

        soup = BeautifulSoup(response.body, 'html5lib')
        login_form = soup.find('form', attrs={'name': "accessform"})
        req_info = parse_url(response.effective_url)
        login_action_url = req_info.scheme + \
            "://" + req_info.host + login_form['action']
        # the cookie set by the login page fetch response
        response = self.fetch(login_action_url,
                              data={
                                   'user_id': username,
                                   'alt_id': '',
                                   'password': password
                                   })
        results = self.get_renewable_list(response.body)
        if(results is None):
            return None
        else:
            # add host and scheme to action
            action, renewable_dict = results
            req_info = parse_url(response.effective_url)
            renew_url = req_info.scheme + '://' + req_info.host +\
                action
            return renew_url, renewable_dict

    @staticmethod
    def get_renewable_list(htmlbody):
        '''
        @param BeautifulSoup soup: the html page in bytes which
                contains the renewable books list
        return action_string, renewable dict in tuple
        '''
        renewable_dict = dict()
        soup = BeautifulSoup(htmlbody, 'html5lib')
        renew_form = soup.find('form', attrs={'name': 'renewitems'})
        pattern = re.compile('itemlisting2?')
        if(renew_form is not None):
            tds = renew_form.findAll('td', attrs={'class': pattern})
            if(len(tds) == 0):
                return None
            else:
                # every 3 tds represent one book in:
                # 1. renew or not checkbox
                # 2. book name string
                # 3. the expire date of the book
                for index in range(0, len(tds), 3):
                    name = tds[index].input['name']
                    date_str = tds[index+2].strong.get_text()
                    if(date_str not in renewable_dict):
                        renewable_dict[date_str] = list()
                    renewable_dict[date_str].append(name)
                return renew_form['action'], renewable_dict
        else:
            return None

    def auto_renew(self):
        results = self.login_and_get_renewable_list()
        tz = timedelta(hours=8)
        left_time = timedelta(hours=5)
        if(results is not None):
            renew_url, renewable = results
            logger.debug(renewable)
            for date_str in renewable:
                date = datetime.strptime(date_str, '%Y/%m/%d,%H:%M')
                datetime_now = datetime.utcnow() + tz
                if(date > datetime_now and
                        (date - datetime_now) < left_time):
                    post_dict = {
                            'uid': self._username,
                            'selection_type': 'selected'}
                    for book in renewable[date_str]:
                        post_dict[book] = 'on'
                    response = self.fetch(renew_url, post_dict)
                    if(self.isRenewSuccess(response.body) is True):
                        # mail
                        pass

    @staticmethod
    def isRenewSuccess(htmlbody):
        soup = BeautifulSoup(htmlbody, 'html5lib')
        table = soup.find(
                'table',
                attrs={'summary':
                       "This table positions all the elements on this page."}
                )
        if(table is None):
            return False
        # continue
        header = table.find('td', attrs={'class': 'header'})
        if(header is None):
            return False
        # continue
        pattern = re.compile(r'[0-9] 馆藏已续借.')
        if(pattern.match(header.get_text().strip()) is not None):
            return True
        else:
            return False


if __name__ == '__main__':
    from argparse import ArgumentParser
    import time
    parser = ArgumentParser()
    parser.add_argument('-u', '--username', required=True,
                        metavar='NAME', help='sxlib username')
    parser.add_argument('-p', '--password', required=True,
                        metavar='PASSWORD', help='sxlib password')
    result = parser.parse_args()
    relender = Relend(result.username, result.password)
    while True:
        relender.auto_renew()
        time.sleep(3*60*60)  # sleep 3 hours
