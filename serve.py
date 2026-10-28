from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from functools import partial
print('Local: http://127.0.0.1:8765',flush=True)
ThreadingHTTPServer(('127.0.0.1',8765),partial(SimpleHTTPRequestHandler,directory='dist')).serve_forever()
