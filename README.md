# Nodejs UDP Tracking


## Requirements

+ Docker and Docker Compose
+ UDP packet sender

## How to 

Once in project folder :

`docker-compose build`
and
`docker-compose up`

## Configuration 

+ Web server: localhost:3000
+ Udp server: 127.0.0.1:3001

## Use
+ #### UDP package format

{latitude,longitude,time,device,speed}

#### Datatype
+ Latitude, Longitude <- Real 
+ time <- Int
+ Device <- String (Just "A" or "B")
+ Speed <- Real

