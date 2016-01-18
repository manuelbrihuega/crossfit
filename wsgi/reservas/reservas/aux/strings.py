# -*- coding: utf-8 -*-
import re
import unidecode

def string_to_compare(string):
    string=string.replace("-"," ")
    string=string.replace("_"," ")
    string=string.replace("."," ")
    string=string.upper()
    string=string.strip()
    return string


def slugify(str):
    str = unidecode.unidecode(str).lower()
    return re.sub(r'\W+','-',str)
    

def getBoolValue(valor):
    if valor==1 or valor == "1" or valor == "true" or valor=="True":
        return True
    else:
        return False

def getIntValue(value, default=0):
    try:
        return int(value)
    except:
        return default