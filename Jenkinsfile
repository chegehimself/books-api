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
        stage('Test Report') {
            steps {
                // Run coverage
                sh 'npm run coverage'
                junit 'coverage/*.html'
            }
        }
    }
}
