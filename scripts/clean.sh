# If node_modules dir exists, delete it.
if test -d node_modules
then
  rm -r node_modules
fi

# If .next dir exists, delete it.
if test -d .next
then
  rm -r .next
fi