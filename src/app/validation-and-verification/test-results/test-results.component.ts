import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { ChartService } from '../../shared/services/common/chart.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
    selector: 'app-test-results',
    templateUrl: './test-results.component.html',
    styleUrls: [ './test-results.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class TestResultsComponent implements OnInit {
    loading: boolean;
    detail = {};
    charts = {
        ds: {
            chart: [],
            type_: [],
            title: [],
            xTtle: [],
            yTtle: []
        },
        s1: {
            serie: [],
            xAxis: [],
            yAxis: []
        },
        s2: {
            serie: [],
            xAxis: [],
            yAxis: []
        },
        s3: {
            serie: [],
            xAxis: [],
            yAxis: []
        }
    };

    testUUID: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private utilsService: UtilsService,
        private chartService: ChartService,
        private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.testUUID = params[ 'id' ];
            this.requestResults(params[ 'results_uuid' ]);
        });
    }

    requestResults(uuid) {
        this.loading = true;
        this.verificationAndValidationPlatformService
            .getTestResults(uuid)
            .then(response => {
                this.loading = false;
                this.detail = response;

                if (this.detail[ 'graphs' ]) {
                    this.setChartData(this.detail[ 'graphs' ]);
                    this.createChart();
                }
            })
            .catch(err => {
                this.loading = false;
                this.utilsService.openSnackBar(err, '');
                this.close();
            });
    }

    setChartData(graph) {
        graph.forEach((item, i) => {
            this.charts[ 'ds' ][ 'chart' ].push(i);
            this.charts[ 'ds' ][ 'type_' ].push(item[ 'type' ]);
            this.charts[ 'ds' ][ 'title' ].push(item[ 'title' ]);
            this.charts[ 'ds' ][ 'xTtle' ].push(item[ 'x-axis-title' ]);
            this.charts[ 'ds' ][ 'yTtle' ].push(item[ 'y-axis-title' ]);
            this.charts[ 's1' ][ 'serie' ].push(item[ 'series' ][ 's1' ]);
            this.charts[ 's1' ][ 'xAxis' ].push(item[ 'data' ][ 's1x' ]);
            this.charts[ 's1' ][ 'yAxis' ].push(item[ 'data' ][ 's1y' ]);
            this.charts[ 's2' ][ 'serie' ].push(item[ 'series' ][ 's2' ]);
            this.charts[ 's2' ][ 'yAxis' ].push(item[ 'data' ][ 's2y' ]);
            this.charts[ 's3' ][ 'serie' ].push(item[ 'series' ][ 's3' ]);
            this.charts[ 's3' ][ 'yAxis' ].push(item[ 'data' ][ 's3y' ]);
        });
    }

    createChart() {
        setTimeout(() => {
            for (let i = 0; i < this.charts[ 'ds' ][ 'chart' ].length; i++) {
                const s1Line = [
                    {
                        label:
                            '[ ' +
                            's1: ' +
                            ' " ' +
                            this.charts[ 's1' ][ 'serie' ][ i ] +
                            ' " ' +
                            ' ]',
                        data: this.charts[ 's1' ][ 'yAxis' ][ i ],
                        fill: false,
                        lineTension: 0.2,
                        backgroundColor: '#f0f0f0',
                        borderColor: 'red',
                        borderWidth: 0.8
                    }
                ],
                    s2Line = [
                        s1Line[ 0 ],
                        {
                            label:
                                '[ ' +
                                's2: ' +
                                ' " ' +
                                this.charts[ 's2' ][ 'serie' ][ i ] +
                                ' " ' +
                                ' ]',
                            data: this.charts[ 's2' ][ 'yAxis' ][ i ],
                            fill: false,
                            lineTension: 0.2,
                            backgroundColor: '#f0f0f0',
                            borderColor: 'blue',
                            borderWidth: 0.8
                        }
                    ],
                    s3Line = [
                        s2Line[ 0 ],
                        s2Line[ 1 ],
                        {
                            label:
                                '[ ' +
                                's3: ' +
                                ' " ' +
                                this.charts[ 's3' ][ 'serie' ][ i ] +
                                ' " ' +
                                ' ]',
                            data: this.charts[ 's3' ][ 'yAxis' ][ i ],
                            fill: false,
                            lineTension: 0.2,
                            backgroundColor: '#f0f0f0',
                            borderColor: 'brown',
                            borderWidth: 0.8
                        }
                    ],
                    chartData = {
                        chart: 'chart-' + this.charts[ 'ds' ][ 'chart' ][ i ], // "chart-" +
                        type_: this.charts[ 'ds' ][ 'type_' ][ i ],
                        title: this.charts[ 'ds' ][ 'title' ][ i ],
                        xTtle: this.charts[ 'ds' ][ 'xTtle' ][ i ],
                        xAxis: this.charts[ 's1' ][ 'xAxis' ][ i ],
                        yTtle: this.charts[ 'ds' ][ 'yTtle' ][ i ],
                        yAxis: this.charts[ 's2' ][ 'yAxis' ][ i ]
                    };

                if (
                    this.charts[ 's1' ][ 'yAxis' ][ i ] !== undefined &&
                    this.charts[ 's2' ][ 'yAxis' ][ i ] !== undefined &&
                    this.charts[ 's3' ][ 'yAxis' ][ i ] !== undefined
                ) {
                    this.chartService.createChart(true, s3Line, chartData);
                } else if (
                    this.charts[ 's1' ][ 'yAxis' ][ i ] !== undefined &&
                    this.charts[ 's2' ][ 'yAxis' ][ i ] !== undefined
                ) {
                    this.chartService.createChart(true, s2Line, chartData);
                } else if (this.charts[ 's1' ][ 'yAxis' ][ i ] !== undefined) {
                    this.chartService.createChart(false, s1Line, chartData);
                }
            }
        }, 400);
    }

    close() {
        this.router.navigate([ 'validation-and-verification/tests', this.testUUID ]);
    }
}
