import { Injectable, Output, EventEmitter } from "@angular/core";
import { Chart } from "chart.js";

@Injectable()

export class ChartService {

  ChartBar = [];

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  chartBar(axis2, axis2Title, id, type, title, xTitle, yAxis, yAxis2, yTitle, xAxis) {

    Chart.defaults.global.defaultFontFamily = "Calibri";
    Chart.defaults.global.defaultFontSize = 16;
    Chart.defaults.global.defaultFontColor = "#828188";

    this.ChartBar = new Chart(id, {
      type: type,
      data: {
        labels: xAxis,
        datasets: [
          {
            label: "[ s1 ]",
            data: yAxis,
            fill: false,
            lineTension: 0.2,
            backgroundColor: "#f0f0f0",
            borderColor: "#d40b0d",
            borderWidth: 0.8
          },
          {
            hidden: axis2,
            label: "[ s2 ]",
            data: yAxis2,
            fill: false,
            lineTension: 0.2,
            backgroundColor: "#f0f0f0",
            borderColor: "#d40b0d",
            borderWidth: 0.8
          }
        ]
      },
      options: {
        title: { 
          display: true,
          text: title,
        },
        legend: {
          display: axis2Title,
          labels: {
            boxWidth: 0,
            padding: 10,
            fontSize: 14,
            // hidden: true,
            fontFamily: "Lato"
          }
        },
        tooltips: {
          enabled: true,
          mode: "single",
          custom: function(tooltip) { 
            if (!tooltip) return; 
            tooltip.displayColors = false; 
            tooltip.xPadding = 10; 
            },  
            callbacks: {                                                               
              label: function(tooltipItem, data) { return '' + tooltipItem.yLabel;  }, 
              title: function(tooltipItem, data) { return '';                       }, 
            },
        },
        elements: { 
          point: { 
            radius: 4 
          } 
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true, 
                suggestedMax: Math.max(...yAxis2)*1.2
              },
              scaleLabel: {
                display: true,
                fontSize: 14,
                labelString: yTitle,
                fontFamily: "Helvetica",
                fontColor: "#000",
              }
            }
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                fontSize: 14,
                labelString: xTitle,
                fontFamily: "Helvetica",
                fontColor: "#000"
              },
            }
          ]
        },
        responsive: true
      }
    });
  }

}
