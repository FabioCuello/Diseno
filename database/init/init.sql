USE project1;

CREATE TABLE data( 
lat FLOAT (25,12), 
lon FLOAT (25,12), 
time BIGINT NOT NULL, 
device VARCHAR(25),
speed FLOAT(6,2) ,
num int AUTO_INCREMENT,
PRIMARY KEY (num),
FOREIGN KEY(device) REFERENCES devices(device)
);

CREATE TABLE devices(
device VARCHAR(25),
PRIMARY KEY(device)
);