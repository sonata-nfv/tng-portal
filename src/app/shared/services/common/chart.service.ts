import { Injectable, Output, EventEmitter } from "@angular/core";
import { Chart } from "chart.js";

@Injectable()
export class ChartService {
  @Output()
  change: EventEmitter<boolean> = new EventEmitter();

  createChart(menu, series, chartData): Chart {
    Chart.defaults.global.defaultFontFamily = "Calibri";
    Chart.defaults.global.defaultFontSize = 16;
    Chart.defaults.global.defaultFontColor = "#828188";

    return new Chart(chartData["chart"], {
      type: chartData["type_"],
      data: {
        labels: chartData["xAxis"],
        datasets: series
      },
      options: {
        title: {
          display: true,
          text: chartData["title"]
        },
        legend: {
          display: menu,
          labels: {
            fontColor: "black",
            boxWidth: 20,
            padding: 10,
            fontSize: 14,
            hidden: true,
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
            label: function(tooltipItem, data) {
              return "" + tooltipItem.yLabel;
            },
            title: function(tooltipItem, data) {
              return "";
            }
          }
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
                suggestedMax: Math.max(...chartData["yAxis"]) * 1.2
              },
              scaleLabel: {
                display: true,
                fontSize: 14,
                labelString: chartData["yTtle"],
                fontFamily: "Helvetica",
                fontColor: "#000"
              }
            }
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                fontSize: 14,
                labelString: chartData["xTtle"],
                fontFamily: "Helvetica",
                fontColor: "#000"
              }
            }
          ]
        },
        responsive: true
      }
    });
  }
}
