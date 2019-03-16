pipeline {
    agent any
    stages {
    stage('Install dependencies') {
          steps {
            sh 'npm install'
          }
        }
        stage('Test') {
            steps {
                // Run the tests
                sh 'npm test'
                sh 'npm coverage'
            }
        }
    }
}
