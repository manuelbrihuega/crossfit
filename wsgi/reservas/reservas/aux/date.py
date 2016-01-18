from datetime import datetime, timedelta


def utc_date(date,offset):
    try:
        offset=int(offset)
        return date-timedelta(minutes=60*offset)
    except:
        return False



def local_date(date,offset):
    try:
        offset=int(offset)
        return date+timedelta(minutes=60*offset)
    except:
        return False


def get_string_from_date(date):
    try:
        return date.strftime("%Y-%m-%d %H:%M:%S")
    except:
        return ""


def get_date_from_string(date):
    try:
        return datetime.strptime(date,"%Y-%m-%d %H:%M:%S")
    except:
        return None

def get_month_limit(year,month,offset):
    first=0
    last=0
    try:
        offset=int(offset)
        year=int(year)
        month=int(month)
        if month<10:
            month_str="0"+str(month)
        else:
            month_str=str(month)
        date1=datetime.strptime(str(year)+"-"+month_str+"-01 00:00:00", "%Y-%m-%d %H:%M:%S")


        if month==1 or month==3 or month==5 or month==7 or month==8 or month==10 or month==12:
            daylast="31"
        elif month==2:
            if year%4==0:
                daylast="29"
            else:
                daylast="28"
        else:
            daylast="30"

        datelast=datetime.strptime(str(year)+"-"+month_str+"-"+daylast+" 23:59:59", "%Y-%m-%d %H:%M:%S")

        first=date1-timedelta(minutes=60*offset)
        last=datelast-timedelta(minutes=60*offset)
    except:
        pass


    return [first,last]

def get_month_limit_utc(year,month):
    date1=0
    datelast=0
    try:
        year=int(year)
        month=int(month)
        if month<10:
            month_str="0"+str(month)
        else:
            month_str=str(month)
        date1=datetime.strptime(str(year)+"-"+month_str+"-01 00:00:00", "%Y-%m-%d %H:%M:%S")


        if month==1 or month==3 or month==5 or month==7 or month==8 or month==10 or month==12:
            daylast="31"
        elif month==2:
            if year%4==0:
                daylast="29"
            else:
                daylast="28"
        else:
            daylast="30"

        datelast=datetime.strptime(str(year)+"-"+month_str+"-"+daylast+" 23:59:59", "%Y-%m-%d %H:%M:%S")
    except:
        pass


    return [date1,datelast]

def get_year_limit_utc(year):
    date1=0
    datelast=0
    try:
        year=int(year)
        date1=datetime.strptime(str(year)+"-01-01 00:00:00", "%Y-%m-%d %H:%M:%S")
        datelast=datetime.strptime(str(year)+"-12-31 23:59:59", "%Y-%m-%d %H:%M:%S")
    except:
        pass
    return [date1,datelast]

def get_day_limit(year,month,day,offset):
    first=0
    last=0
    try:
        offset=int(offset)
        year=str(year)
        month=str(month)
        day=str(day)
        if len(year) > 2:
            date1=datetime.strptime(year+"-"+month+"-"+day+" 00:00:00", "%Y-%m-%d %H:%M:%S")
            datelast=datetime.strptime(year+"-"+month+"-"+day+" 23:59:59", "%Y-%m-%d %H:%M:%S")
        else:
            date1=datetime.strptime(year+"-"+month+"-"+day+" 00:00:00", "%y-%m-%d %H:%M:%S")
            datelast=datetime.strptime(year+"-"+month+"-"+day+" 23:59:59", "%y-%m-%d %H:%M:%S")

        first=date1-timedelta(minutes=60*offset)
        last=datelast-timedelta(minutes=60*offset)
    except:
        pass
    return [first,last]

def get_day_limit_utc(year,month,day):
    first=0
    last=0
    try:
        year=str(year)
        month=str(month)
        day=str(day)
        if len(year) > 2:
            date1=datetime.strptime(year+"-"+month+"-"+day+" 00:00:00", "%Y-%m-%d %H:%M:%S")
            datelast=datetime.strptime(year+"-"+month+"-"+day+" 23:59:59", "%Y-%m-%d %H:%M:%S")
        else:
            date1=datetime.strptime(year+"-"+month+"-"+day+" 00:00:00", "%y-%m-%d %H:%M:%S")
            datelast=datetime.strptime(year+"-"+month+"-"+day+" 23:59:59", "%y-%m-%d %H:%M:%S")
        first=date1
        last=datelast
    except:
        pass
    return [first,last]

def num_days_of_month(month, year):
    if int(month)==1 or int(month)==3 or int(month)==5 or int(month)==7 or int(month)==8 or int(month)==10 or int(month)==12:
        return 31
    elif int(month)==2 and int(year)%4==0:
        return 29
    elif int(month)==2:
        return 28
    else:
        return 30