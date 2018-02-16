pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'docker build -f ./Dockerfile -t registry.tng-portal.eu:4200/tng-portal .'
            }
        }
        stage('Publishing') {
            steps {
                echo 'Publishing....'
                sh 'docker push registry.tng-portal.eu:4200/tng-portal'
            }
        }
    }
}