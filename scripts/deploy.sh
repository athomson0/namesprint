#!/bin/bash
CURRENT_PATH="$(pwd)"
SCRIPT_PATH="$(cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P)"

cd $SCRIPT_PATH/../ansible
ansible-playbook -i inventory.ini deploy.playbook.yml
cd $CURRENT_PATH
