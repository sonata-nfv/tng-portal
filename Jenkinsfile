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
    }
}