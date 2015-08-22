import moratab
import codecs
file = codecs.open('datafn.md', encoding='utf-8')
data = file.read()
res = moratab.render(data)
f = codecs.open('data.html', 'w', encoding='utf-8')
f.write(res)

