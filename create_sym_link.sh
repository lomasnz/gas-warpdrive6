#!/bin/bash
# Your shell commands here
find . -type f -not -path './.git/*' -not -name 'create_sym_link.sh' -print0 | while IFS= read -r -d '' file; do ln -s "$(realpath "$file")" /Users/armstrongp/Documents/coding/gas-warpdrive6/"$(basename "$file")"; done
