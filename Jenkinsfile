pipeline {
    agent any
    stages {
    stage('Install dependencies') {
          steps {
            checkout scm
            sh 'npm install'
          }
        }
        stage('Test') {
            steps {
                sh 'npm coverage'
             }
        }
    }
}
