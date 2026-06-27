import json

raw = open('d:/04/trae/1.1/01/pmc/面试宝典/static/data.js','r',encoding='utf-8').read()
data = json.loads(raw.replace('export default ','').rstrip(';\n').strip())

with open('d:/04/trae/1.1/01/pmc/面试宝典/question_data.js','w',encoding='utf-8') as f:
    f.write('var questionData = ')
    json.dump(data, f, ensure_ascii=False)
    f.write(';')

html = open('d:/04/trae/1.1/01/pmc/面试宝典/index.html','r',encoding='utf-8').read()
start = html.find('var questionData = [')
end = html.rfind('];') + 2
new_html = html[:start] + "<script src=\"question_data.js\"></script>" + html[end:]
open('d:/04/trae/1.1/01/pmc/面试宝典/index.html','w',encoding='utf-8').write(new_html)
print('Done')
