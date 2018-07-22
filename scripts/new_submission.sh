#!/bin/bash

source "$(dirname $BASH_SOURCE)/shared.sh"

say "What is your GitHub username?"
read username
echo $username > "$ROOT/.username"

dir=$(submission_dir "$username")
mkdir "$dir"

say "working directory: $dir"
cd "$dir"
