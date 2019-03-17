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
        state('Test Report') {
            steps {
                // Run coverage
                sh 'npm run coverage'
            }
        }
    }
}
