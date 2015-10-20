var d3 = require('d3');
import {Component, View, Input, ElementRef} from 'angular2/angular2';
import {Ticker} from '../../services/TickerService';
import { Subscription } from '@reactivex/rxjs';

@Component({
  selector: 'stock-graph'
})
@View({
  template: `<div class="chart"></div>`
})
export class StockGraph {
  subscription: Subscription<any>;

  @Input('ticker') ticker:Ticker;
  values: any[] = new Array(40).fill({price: 50});
  path: any;
  line: any;
  svg: any;
  x: any;
  y: any;

  constructor(private el:ElementRef) {

  }

  render(latestValue){

    this.values.push(latestValue)

    this.path
      .attr("d", this.line)
      .attr("transform", null)
      .transition()
      //.duration(500) //TODO(robwormald):play with this more
      .ease("linear")
      .attr("transform", "translate(" + this.x(-1) + ",0)")
      .each("end",() => this.values.shift());
  }

  onInit() {
    let n = 40;
    let margin = {top: 20, right: 20, bottom: 20, left: 20};
    let width = 700
    let height = 200;

    //x scale
    this.x = d3.scale.linear()
      .domain([0, n - 1])
      .range([0, width])

     //y scale
     this.y = d3.scale.linear()
      .domain([0,100])
      .range([height, 0]);

    this.line = d3.svg.line()
      .x((d, i) => this.x(i))
      .y((d, i) => this.y(d.price));

    this.svg = d3.select(this.el.nativeElement.querySelector('div.chart')).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    this.svg.append("g")
      .style("fill", "none")
      .style("stroke-width", "1.5px")
      .style("stroke", "#000")
      .style("font", "10px sans-serif")
      .attr("transform", "translate(0," + this.y(0) + ")")
      .call(d3.svg.axis().scale(this.x).orient("bottom"))

    this.svg.append("g")
      .style("fill", "none")
      .style("stroke-width", "1.5px")
      .style("font", "10px sans-serif")
      .style("stroke", "#000")
      .call(d3.svg.axis().scale(this.y).orient("left"));

    this.path = this.svg.append("g")
      .attr("clip-path", "url(#clip)")
      .append("path")
      .datum(this.values)
      .style("fill", "none")
      .style("stroke-width", "1.5px")
      .style("stroke", "#00BCD4")
      .attr("d", this.line);

    this.subscription = this.ticker.ticks.subscribe(tick => this.render(tick));
  }

  onDestroy() {
    // This is to work around Angular's View Caching.
    // Actual solution to clearing custom DOM TBD
    this.el.nativeElement.querySelector('div.chart').innerHTML = '';
    const subscription = this.subscription;
    if(subscription) {
      subscription.unsubscribe();
    }
  }
}