pipeline {
    agent any

    stages {
        stage('Build Docker image') {
            steps {
                echo 'Building docker image...'
                sh 'docker build --no-cache -f ./Dockerfile -t registry.sonata-nfv.eu:5000/tng-portal:v4.0 .'
            }
        }
        stage('Publishing') {
            steps {
                echo 'Publishing docker image....'
                sh 'docker push registry.sonata-nfv.eu:5000/tng-portal:v4.0'
            }
        }
        stage('Deploying in pre-int') {
            steps {
                echo 'Deploying in pre-integration....'
                sh 'rm -rf tng-devops || true'
                sh 'git clone https://github.com/sonata-nfv/tng-devops.git'
                dir(path: 'tng-devops') {
                    sh 'ansible-playbook roles/sp.yml -i environments -e "target=sta-sp-v4.0 component=portal"'
                }
            }      
        }
        stage('Deployment in Integration') {
            when {
                branch 'master'
            } 
            steps {
                sh 'docker tag registry.sonata-nfv.eu:5000/tng-portal:latest registry.sonata-nfv.eu:5000/tng-portal:int'
                sh 'docker push registry.sonata-nfv.eu:5000/tng-portal:int'
                sh 'rm -rf tng-devops || true'
                sh 'git clone https://github.com/sonata-nfv/tng-devops.git'
                dir(path: 'tng-devops') {
                    sh 'ansible-playbook roles/sp.yml -i environments -e "target=sta-sp-v4.0 component=portal"'
                }
            }
        }
    }
}
