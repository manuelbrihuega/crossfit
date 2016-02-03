from django.db import models


#PERMISSIONS

class Roles(models.Model):
    role = models.CharField(max_length=50,default="")

    def __unicode__(self):
        return self.role

class Actions(models.Model):
    action = models.CharField(max_length=50,default="")

    def __unicode__(self):
        return self.action

class Permissions(models.Model):
    action = models.ForeignKey('Actions',null=True,blank=True,on_delete = models.CASCADE)
    role = models.ForeignKey('Roles',null=True,blank=True,on_delete = models.CASCADE)

    def __unicode__(self):
        return "Role: "+self.role+" Action: "+self.action


#AUTH

class Auth(models.Model):
    email = models.EmailField(max_length=100,default="")
    password = models.CharField(max_length=250,default="")
    date = models.DateTimeField(default=None,null=True)
    role = models.ForeignKey('Roles',null=True,blank=True,on_delete = models.CASCADE)
    active = models.BooleanField(default=False)
    banned = models.BooleanField(default=False)
    token = models.CharField(max_length=250,default="")
    name = models.CharField(default="",max_length=50)
    surname = models.CharField(default="",max_length=50)
    phone = models.CharField(default="",max_length=20)


    def __unicode__(self):
        return self.email

class Tokenpush(models.Model):
    auth = models.ForeignKey('Auth',null=True,blank=True,on_delete = models.CASCADE)
    token = models.TextField(default="")
    device_type = models.CharField(default="",max_length=5)

    def __unicode__(self):
        return self.token


# SUPER
class U_Super(models.Model):
    auth = models.ForeignKey('Auth',null=True,blank=True,on_delete = models.CASCADE)

    def __unicode__(self):
        return self.auth.name+" "+self.auth.surname

#CUSTOMERS

class U_Customers(models.Model):
    auth = models.ForeignKey('Auth',null=True,blank=True,on_delete = models.CASCADE)
    nif = models.CharField(default="",max_length=20)
    birthdate = models.DateTimeField(default=None,null=True)
    credit_wod = models.IntegerField(default=0,null=False)
    credit_box = models.IntegerField(default=0,null=False)
    paid = models.BooleanField(default=True)
    vip = models.BooleanField(default=False)
    test_user = models.BooleanField(default=False)
    validated = models.IntegerField(default=0)
    rate = models.ForeignKey('Rates', null=True, blank=True,on_delete = models.SET_NULL) 

    def __unicode__(self):
        return self.auth.name+" "+self.auth.surname

#RATES
class Rates(models.Model):
    name = models.CharField(default="",max_length=100)
    price = models.FloatField(default=0.00)
    observations = models.CharField(default="",max_length=255)
    credit_wod = models.IntegerField(default=0,null=False)
    credit_box = models.IntegerField(default=0,null=False)
    tipobono = models.BooleanField(default=False)

    def __unicode__(self):
        return self.name

#ACTIVITIES
class Activities(models.Model):
    name = models.CharField(default="",max_length=100)
    description = models.CharField(default="",max_length=255)
    credit_wod = models.IntegerField(default=0,null=False)
    credit_box = models.IntegerField(default=0,null=False)
    max_capacity = models.IntegerField(default=0,null=False)
    min_capacity = models.IntegerField(default=0,null=False)
    queue_capacity = models.IntegerField(default=0,null=False)

    def __unicode__(self):
        return self.name


#SCHEDULES
class Schedules(models.Model):
    concrete = models.BooleanField(default=False)
    date = models.DateTimeField(default=None,null=True)
    weekly = models.CharField(default="",max_length=100)
    monthly = models.CharField(default="",max_length=100)
    activity = models.ForeignKey('Activities',null=False,blank=False,on_delete = models.CASCADE)
    
    def get_year(self):
        return self.date.year

    def get_day(self):
        return self.date.day

    def get_month(self):
        return self.date.month
        

#SCHEDULES_TIMES
class Schedules_times(models.Model):
    time_start = models.TimeField(default=None,null=False)
    time_end = models.TimeField(default=None,null=False)
    duration = models.IntegerField(default=0,null=False)
    schedule = models.ForeignKey('Schedules', null=False, blank=False,on_delete=models.CASCADE)

#RESERVATIONS
class Reservations(models.Model):
    auth = models.ForeignKey('Auth', null=False, blank=False,on_delete=models.CASCADE)
    schedule_time = models.ForeignKey('Schedules_times', null=False, blank=False,on_delete=models.CASCADE)
    date = models.DateTimeField(default=None,null=False)
    queue = models.BooleanField(default=False)
    position_queue = models.IntegerField(default=0,null=True)


#TICKETS
class Tickets(models.Model):
    title = models.CharField(default="",max_length=255)
    status = models.IntegerField(default=1)
    auth = models.ForeignKey('Auth',null=True,blank=True,on_delete=models.CASCADE)
    email = models.EmailField(max_length=100,default="")

class Messages(models.Model):
    ticket = models.ForeignKey('Tickets',null=True,blank=True,on_delete=models.CASCADE)
    text = models.TextField(default="")
    original_way = models.BooleanField(default=True)
    date = models.DateTimeField(default=None,null=True)

#NEWS
class News(models.Model):
    title = models.CharField(default=None,null=True,max_length=255)
    body = models.TextField(default=None,null=True)
    link = models.CharField(default=None,null=True,max_length=255)
    date = models.DateTimeField(default=None,null=True)
    role = models.ForeignKey('Roles',null=True,blank=True,on_delete=models.CASCADE)

    def __unicode__(self):
        return "Title: "+self.title+" Body: "+self.body

# TASKS
class Tasks(models.Model):
    method = models.CharField(default="",max_length=255)
    date = models.DateTimeField(default=None,null=True)


class Configuration(models.Model):
    days_pre = models.IntegerField(default=0,null=False)
    days_pre_show = models.IntegerField(default=0,null=False)
    minutes_post = models.IntegerField(default=0,null=False)
    minutes_pre = models.IntegerField(default=0,null=False)
    email = models.EmailField(max_length=100,default="")


class Parties(models.Model):
    date = models.DateTimeField(default=None,null=True)
    name = models.CharField(default="",max_length=100)
