pipeline {
  agent {
    node {
      label SLAVE
    }
  }
  stages {
    stage('Preparing') {
      steps {
        echo "Checking if existing dsl-ci container is still running..."
        sh 'if docker ps |  grep dsl-ci > /tmp/test.txt; then docker stop dsl-ci; fi'
        echo 'Building docker image.'
        sh 'docker build -q -f Dockerfile.jenkins -t dsl-ci .'        
        echo 'Starting Container.'
        sh 'docker run --name dsl-ci --rm -d -i -t dsl-ci bash'
        echo 'Frontend: npm install'
        sh "docker exec dsl-ci /bin/bash -c 'cd /home/chrome/dsl/frontend && npm install'"
        echo 'Backend: npm install'
        sh "docker exec dsl-ci /bin/bash -c 'cd /home/chrome/dsl/backend && npm install'"
      }
    }
    stage('Versions Dump.') {
      steps {
        sh "docker exec dsl-ci /bin/bash -c 'npm --version'"
        sh "docker exec dsl-ci /bin/bash -c 'ng --version'"
      } 
    }
    stage ('Building.') {
      steps {
        echo 'Building frontend.'
        sh "docker exec dsl-ci /bin/bash -c 'cd /home/chrome/dsl/frontend && ng build'"
        echo 'Building backend.'
        sh "docker exec dsl-ci /bin/bash -c 'cd /home/chrome/dsl/backend && npm run build'"
      }
    }
    stage ('Testing.') {
      steps{
        echo 'Testing frontend.'
        sh "docker exec dsl-ci /bin/bash -c 'cd /home/chrome/dsl/frontend && ng test --watch false'"
        echo 'Testing backend.'
        sh "docker exec dsl-ci /bin/bash -c 'cd /home/chrome/dsl/backend && bash run_tests.sh'"
      }
    }
    stage('Linting.') {
      steps {
        echo 'Linting frontend.'
        sh "docker exec dsl-ci /bin/bash -c 'cd /home/chrome/dsl/frontend && ng lint'"
        echo 'Linting frontend.'
        sh "docker exec dsl-ci /bin/bash -c 'cd /home/chrome/dsl/backend && npm run pretest'"
      }
    }
  stage('Finishing.') {
      steps {
        echo 'Removing container.'
        sh "docker stop dsl-ci"
      }
    }
  }
}

