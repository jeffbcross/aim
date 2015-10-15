import {Observable, Subject} from '@reactivex/rxjs';
import {Server} from 'ws';
import {createServer} from 'http';
import * as express from 'express';
import * as fs from 'fs';
import 'es6-shim';

var cors = require('cors');

var app = express();
app.use(cors());

let stocks = require('../data/nyse-listed.json').map(stock => {
  return {
    company_name: stock['Company Name'],
    symbol: stock['ACT Symbol']
  }
});

const searchStocks = query => {
  query.symbol = query.symbol ? query.symbol.toLowerCase() : false;
  query.company_name = query.company_name ? query.company_name.toLowerCase() : false;

  return (stock) => {
    //prefer symbol
    if(query.symbol){
      return stock.symbol.toLowerCase().startsWith(query.symbol);
    }
    return stock.company_name.toLowerCase().startsWith(query.company_name);
  }
}


app.get('/stocks', function (req, res) {
  if(!req.query.company_name && !req.query.symbol){
    return res.json([]);
  }
  res.json(stocks.filter(searchStocks(req.query)));
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Stock Server app listening at http://%s:%s', host, port);
});

//creates a new server socket Subject
const createRxSocket = (connection) => {
  let messages = Observable.fromEvent(connection, 'message', (message) => JSON.parse(message));
  let messageObserver:any = {
    next(message){
      connection.send(message);
    }
  }
  return Subject.create(messages, messageObserver);
}

//creates an instance of the websocket server;
const createRxServer = (options) => {
  return new Observable(serverObserver => {
    console.info('started server...');
    let wss = new Server(options);
    wss.on('connection', connection => serverObserver.next(connection));
    return () => {
      wss.close();
    }
  });
}

const socketServer = createRxServer({port: 8081});
const connections = socketServer.map(createRxSocket);

let messageEvents$ = connections.flatMap(connection => connection.map(message => ({connection, message})));

messageEvents$
  .subscribe(({connection, message:{symbol}}:any) => {
    connection.next(JSON.stringify({
      symbol,
      price: Math.random() * 100,
      timestamp: Date.now()
    }));
  });
