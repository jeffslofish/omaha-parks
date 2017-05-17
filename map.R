library(shiny)
library(leaflet)
library(RColorBrewer)
library(tidyverse)
library(DT)

parks <- read_csv("data/park-test.csv")

ui <- bootstrapPage(
  fluidRow(
    column(12, leaflet::leafletOutput("map"))
  ), #end fluidRow
  fluidRow(
    column(12, DT::dataTableOutput("tbl"))
  )
) # end bootstrapPage

server <- function(input, output, session) {
  
  output$map <- leaflet::renderLeaflet({
    leaflet::leaflet(parks) %>% 
      leaflet::addProviderTiles(providers$HikeBike) %>% 
      leaflet::addMarkers()
  }) # end output$map
  
  in_bounding_box <- function(data, latitude, longitude, bounds) {
    data %>% 
      dplyr::filter(latitude > bounds$south & latitude < bounds$north & longitude < bounds$east & longitude > bounds$west)
  }
  
  data_map <- reactive({
    if (is.null(input$map_bounds)) {
      parks
    } else {
      bounds <- input$map_bounds
      in_bounding_box(parks, latitude, longitude, bounds)
    }
  }) # end reactive
  
  output$tbl <- DT::renderDataTable({
    DT::datatable(data_map(), filter = 'top', extension = "Scroller", style = "default", 
                  class="cell-border stripe", width = "100%", rownames = FALSE, selection = "single",
                  options = list(deferRender = TRUE, scrollY = 300, scroller = TRUE, dom = "tp", stateSave = TRUE)
                  ) # end datatable 
  }) # end output$tbl
  
} # end server

shinyApp(ui = ui, server = server)