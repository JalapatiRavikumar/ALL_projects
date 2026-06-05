# Set JAVA_HOME and run backend
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"

Write-Host "Starting backend on http://localhost:8080" -ForegroundColor Green
mvn spring-boot:run
