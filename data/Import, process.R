#seattle example
setwd("~/Dropbox/Projects/Brookings/DataViz/FreightPorts/data/source/")

intl <- read.csv("Seattle_Port_Data/Seattle_Port_Data_Intl.txt")
dom <- read.csv("Seattle_Port_Data/Seattle_Port_Data_DomConnect.txt")

assemble <- function(code){
  code <- as.character(code)
  i <- intl[as.character(intl$Port_Code)==code,]
  d <- dom[as.character(dom$Port_Code)==code,]
  
  TOT <- sum(i$Value_2010)
  LOC <- sum(d[d$Port_Code==d$Dom_ID,"Value_2010"])/sum(d$Value_2010)
  
  MODE <- aggregate(i[c("Value_2010")], by=i[c("I_Mode")], "sum")
  MODE <- MODE[order(MODE$Value_2010, decreasing=TRUE),]
  MODE <- MODE[1:5,]
  COMM <- aggregate(i[c("Value_2010")], by=i[c("Group_ID")], "sum")
  COMM <- COMM[order(COMM$Value_2010, decreasing=TRUE),]
  COMM <- COMM[1:5,]
  
  IGEO <- aggregate(i[c("Value_2010")], by=i[c("Intl_Geography")], "sum")
  IGEO <- IGEO[order(IGEO$Value_2010, decreasing=TRUE),]
  IGEO <- IGEO[1:10,]
  
  DGEO <- aggregate(d[c("Value_2010")], by=d[c("Dom_Geography")], "sum")
  DGEO <- DGEO[order(DGEO$Value_2010, decreasing=TRUE),]
  DGEO <- DGEO[1:10,]
  
  L <- list()
  L$TOT <- TOT
  L$LOC <- LOC
  L$MODE <- MODE
  L$COMM <- COMM
  L$ODI <- IGEO
  L$ODD <- DGEO
  
  return(L)
  
}

seattle <- assemble(42660)

library(jsonlite)
json<-toJSON(seattle,factor="string",na="null",digits=5)
writeLines(json, "~/Dropbox/Projects/Brookings/DataViz/FreightPorts/data/FreightPortsData.json")

#eda
sum(intl$Value_2010)
sum(dom$Value_2010)

