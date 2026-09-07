import urllib.request
import re

def get_live_video_id(channel_url):
    try:
        req = urllib.request.Request(channel_url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        match = re.search(r'"videoId":"([a-zA-Z0-9_-]+)"', html)
        if match:
            return match.group(1)
        return "Not found"
    except Exception as e:
        return str(e)

print('Makkah (SaudiQuranTv):', get_live_video_id('https://www.youtube.com/@SaudiQuranTv/live'))
print('Makkah (qurantvsa):', get_live_video_id('https://www.youtube.com/@qurantvsa/live'))
print('Madinah (SaudiSunnahTv):', get_live_video_id('https://www.youtube.com/@SaudiSunnahTv/live'))
