pipeline {
    agent any
    
    stages {
		stage('Setup npm') {
			steps {
				sh 'npm i'
			}
		}
        stage('Test') {
			steps {
				sh 'npm run lint';
				sh 'npm run scss-lint';
			}
		}
        stage('Documentation') {
			when {
				branch 'master'
			}
			steps {
				sh 'npm run doc';
				publishHTML([
					allowMissing: false,
					alwaysLinkToLastBuild: false,
					keepAll: false,
					reportDir: 'documentation/',
					reportFiles: 'index.html',
					reportName: 'Documentation',
					reportTitles: 'Compodoc'
					])
			}
		}
        stage('Build Docker image') {
            steps {
                echo 'Test styles and building docker image...'
                sh 'docker build --no-cache -f ./Dockerfile -t registry.sonata-nfv.eu:5000/tng-portal .'
            }
        }
        stage('Publishing') {
            steps {
                echo 'Publishing docker image....'
                sh 'docker push registry.sonata-nfv.eu:5000/tng-portal'
            }
        }
        stage('Deploying in pre-int') {
            steps {
                echo 'Deploying in pre-integration....'
                sh 'rm -rf tng-devops || true'
                sh 'git clone https://github.com/sonata-nfv/tng-devops.git'
                dir(path: 'tng-devops') {
                    sh 'ansible-playbook roles/sp.yml -i environments -e "target=pre-int-sp component=portal"'
                    sh 'ansible-playbook roles/vnv.yml -i environments -e "target=pre-int-vnv component=portal"'
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
                    sh 'ansible-playbook roles/sp.yml -i environments -e "target=int-sp component=portal"'
                }
            }
        }
    }
}
