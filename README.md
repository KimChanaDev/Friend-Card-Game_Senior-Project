# HOW TO RUN ON LOCAL MACHINE

1. create .env file in the Server folder  
   server environment requirement in .env file are

        CLIENT_URL=  
        PORT=  
        MONGO_USER=  
        MONGO_PASSWORD=  
        MONGO_PATH=  
        TYPE=  
        PROJECT_ID=  
        PRIVATE_KEY_ID=  
        PRIVATE_KEY=  
        CLIENT_EMAIL=  
        CLIENT_ID=  
        AUTH_URI=  
        TOKEN_URI=  
        AUTH_PROVIDER_X509_CERT_URL=  
        CLIENT_X509_CERT_URL=  
        UNIVERSE_DOMAIN=

2. create .env file in the FCG_front-end folder  
   client environment requirement in .env file is

        REACT_APP_SERVER_PORT=  

3. run docker docker container

        docker-compose up --build -d

4. access web app on

        http://localhost:8080/
