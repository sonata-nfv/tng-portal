pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'docker build -f ./Dockerfile -t registry.sonata-nfv.eu:5000/tng-portal .'
            }
        }
        stage('Publishing') {
            steps {
                echo 'Publishing....'
                sh 'docker push registry.sonata-nfv.eu:5000/tng-portal'
            }
        }
        stage('Deployment in Integration') {
          parallel {
            stage('Deployment in Integration') {
              steps {
                echo 'Deploying in integration...'
              }
            }
            stage('Deploying') {
              steps {
                sh 'rm -rf tng-portal || true'
                sh 'git clone https://github.com/sonata-nfv/tng-portal.git'
                dir(path: 'tng-devops') {
                  sh 'ansible-playbook roles/sp.yml -i environments -e "target=pre-int-sp host_key_checking=False"'
                }
              }
            }
          }
        }
    }
}
