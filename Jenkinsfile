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
                // Run the tests
                sh 'npm test'
            }
        }
    }
}
