from reservas.models import *

###############################
###   AUX PERMISSIONS
###############################


def have_permission(auth_id,action):
    try:
        auth=Auth.objects.get(id=auth_id)
        candidate=Permissions.objects.filter(action__action=action,role=auth.role)
        return (len(candidate)>0 or auth.role.role=='U_Super')
    except:
        return False


def is_role(auth_id,role):
    try:
        Auth.objects.get(id=auth_id,role__role=role)
        return True
    except:
        return False