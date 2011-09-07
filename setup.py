from setuptools import setup, find_packages
import os

def gen_data_files(*dirs):
    results = []
    
    for src_dir in dirs:
        for root,dirs,files in os.walk(src_dir):
            results.append((root, map(lambda f:root + "/" + f, files)))
    return results
    
setup(
    name = "M5",
    version = "0.3.2",
    # metadata for upload to PyPI
    author = "Scott Persinger",
    author_email = "scottpersinger@gmail.com",
    description = "HTML5 mobile app toolkit",
    license = "LICENSE.txt",
    keywords = "html5 mobile apps",
    url = "http://m5apps.org/",   # project home page, if any
    packages = ['m5'],
    scripts = ['m5/m5'],
    
    install_requires = ['slimit>=0.5.3','bottle>=0.9.5','cherrypy','urllib2-file','Markdown'],

    data_files = gen_data_files("docs", "lib", "jquery-mobile", "templates"),

    # could also include long_description, download_url, classifiers, etc.
)
