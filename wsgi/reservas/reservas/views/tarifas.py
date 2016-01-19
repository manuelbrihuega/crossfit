# -*- coding: utf-8 -*-

from django.http import HttpResponse
from django.forms.models import model_to_dict
import json


from reservas.models import *

#from api.aux.permissions import *
from reservas.aux.auth import *
from reservas.aux.general import *
#from api.aux.mailchimp import *


def list_all(request):
    """
    List all rates
    """
    try:
        items = Rates.objects.all()
        items_list = []
        filtering=False
        for item in items:
            items_list.append({'id':item.id, 'name':item.name,'price':item.price,'credit_box':item.credit_box,'credit_wod':item.credit_wod})

        data = json.dumps({'status': 'success', 'response':'rates_list', 'data':{'rates':items_list}})

    except Exception as e:
        data = json.dumps({'status': 'failed', 'response':'internal_error (%s)' % e.args[0] })

    return APIResponse(request,data)