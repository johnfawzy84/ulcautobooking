# ulcautobooking
- [ulcautobooking](#ulcautobooking)
  - [Überblick](#überblick)
  - [Skript](#skript)
  - [Pipeline](#pipeline)
  - [Changes](#changes)
    - [07.04.2021 - Service available but not 11Uhr](#07042021---service-available-but-not-11uhr)
## Überblick 
Das ist ein Automatische buchung skript für Urban Life Church System für Sonntag Kirche. 

## Skript
Das Skript funktioniert mit Nodejs und Puppeteer, Das Skript macht folgendes : 
1. Checkt 500 mal ob das Website schon hat die Events 
2. Wenn Ja, Klickt auf Reservierung 
3. Trägt ein Daten für die Reservierung 

## Pipeline 
Triggert den Skript bei Azure Pipeline

## Changes
### 07.04.2021 - Service available but not 11Uhr
The latest change was becasue the pipeline failed, since there were a service , so the table didn't have ( Keine veranstalung ), but it wasn't the 11Uhr service. 
So the script started searching for elements to that is not availale and timed-out. 

The solution was to make the while loop to include the search for the service name, and if the service is also found, the booking process should start.

