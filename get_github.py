import urllib.request
import re
html = urllib.request.urlopen("https://www.youtube.com/watch?v=hfGz5AgHT-E").read().decode("utf-8")
matches = re.findall(r"https://github\.com/[^\\]*", html)
for m in set(matches):
    print(m)
