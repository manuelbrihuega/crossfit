#!/bin/bash

cd $OPENSHIFT_HOMEDIR/app-root/repo/wsgi/reservas
for i in `seq 1 11`;
do
	echo "from reservas.aux.tasks import revise_tasks;revise_tasks();quit();" | python manage.py shell
	sleep 5
done
