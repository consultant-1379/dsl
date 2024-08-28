# This script is used to set the version of DSL

build_type='DEV'

while getopts 'r' flag; do
  case "${flag}" in
    r) build_type='RELEASE' ;;
  esac
done

if [ "$build_type" == 'RELEASE' ]
then
  version=$(git describe --tag --abbrev=0)
else
  timestamp="$(date +"%Y-%m-%d:%H-%M-%S")"
  version="0.0.1-<${timestamp}>"
fi
echo "DSL version has been set to: ${version}"
sed -i -e "s/<%VERSION_INFO%>/${version}/g" ./build/routes/index.js
