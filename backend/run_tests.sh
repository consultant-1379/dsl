# This script runs the Jasmine tests for the backend
# In our project, we do not use the default jasmine reporter. Instead,
#   we use the jasmine-spec-reporter (https://github.com/bcaudan/jasmine-spec-reporter).

# Usage: run-tests.sh [OPTIONS]
#     -a          (all) runs all tests, both unit and integration. By default, only unit tests are run.
#     -i          (integration) runs integration tests. By default, only unit tests are run.
#     -e <value>  (env) sets the NODE_ENV variable to the value provided

# This script can be run with options via npm
#     npm test -- -[OPTIONS]
#     eg.   npm test -- -ae ecrebri

print_usage() {
  echo "Usage: run-tests.sh [OPTIONS]"
  echo "    -a          (all) runs all tests, both unit and integration. By default, only unit tests are run."
  echo "    -i          (integration) runs integration tests. By default, only unit tests are run."
  echo "    -e <value>  (env) sets the NODE_ENV variable to the value provided"
  echo ""
  echo "This script can be run with options via npm"
  echo "    npm test -- -[OPTIONS]"
  echo "    eg.   npm test -- -ae ecrebri"
  exit 1
}

test_type='UNIT'
env_arg=''
node_env='test'

while getopts 'aie:' flag; do
  case "${flag}" in
    a) test_type='ALL' ;;
    i) test_type='INTEGRATION' ;;
    e) env_arg="$OPTARG" ;;
    *) print_usage ;;
  esac
done

if [ -n "$env_arg" ]
then
  node_env="${env_arg}"
fi

if [ "$test_type" = 'ALL' ]
then
  config_path='./jasmine/jasmine_all_tests.json'
elif [ "$test_type" = 'INTEGRATION' ]
then
  config_path='./jasmine/jasmine_integration.json'
else
  config_path='./jasmine/jasmine.json'
fi

# start jasmine tests
NODE_ENV="${node_env}" TEST_TYPE="${test_type}" npx jasmine JASMINE_CONFIG_PATH="${config_path}" --helper=./jasmine/helpers/setup.js
