pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                echo 'Installing app dependencies...'
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                echo 'Building app...'
                sh 'npm run build'
            }
        }
        stage('Build Docker image') {
            steps {
                echo 'Building docker image...'
                sh 'docker build --no-cache -f ./Dockerfile -t registry.sonata-nfv.eu:5000/tng-portal .'
            }
        }
        stage('Publishing') {
            steps {
                echo 'Publishing docker image....'
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
                sh 'rm -rf tng-devops || true'
                sh 'git clone https://github.com/sonata-nfv/tng-devops.git'
                dir(path: 'tng-devops') {
                  sh 'ansible-playbook roles/sp.yml -i environments -e "target=pre-int-sp host_key_checking=False"'
                }
              }
            }
          }
        }
    }
}
