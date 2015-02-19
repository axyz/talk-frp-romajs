;(function (document, window, $, Bacon, d3, c3, undefined) {
  'use strict';

  $(function () {

    /*=============*
     * DEFINITIONS *
     *=============*/

    var ws = new WebSocket("ws://centoquaranta.herokuapp.com");

    // stream with all the tweets received from ws
    var tweetStream = Bacon.fromEventTarget(ws, 'message')
    .map(function (event) {
      return JSON.parse(event.data);
    });

    // stream with all the tweets buffered every 5 seconds
    // ====================================
    //      source: a--bc-d----ef-g--h---->
    // buffered(5): a----b----c----d----e->
    var visualizedTweetStream = tweetStream
    .bufferingThrottle(5000);

    // counter for visualized tweets
    // ====================================
    //      source: a----b----c----d----e->
    //      map(1): 1----1----1----1----1->
    //  scan(0, +): 1----2----3----4----5->
    var visualizedTweetCount = visualizedTweetStream
    .map(1)
    .scan(0, function (prev, next) {
      return prev + next;
    });

    // counter for received tweets
    // ===================================
    //     source: a--bc-d----ef-g--h---->
    //     map(1): 1--11-1----11-1--1---->
    // scan(0, +): 1--23-4----56-7--8---->
    var receivedTweetCount = tweetStream
    .map(1)
    .scan(0, function (prev, next) {
      return prev + next;
    });

    // tweets/min rate stream
    var tweetRate = tweetStream
    .bufferWithTime(10000)
    .map(".length")
    .map(function (n) {
      return (n / 10) * 60;
    });



    /*=============*
     * GAUGE CHART *
     *=============*/

    // http://c3js.org/samples/chart_gauge.html
    var gauge = c3.generate({
      bindto: '#gauge',
      data: {
        columns: [
          ['data', 0]
        ],
        type: 'gauge',
      },
      gauge: {
        max: 100,
        units: ' tweet/min',
        width: 70
      },
      color: {
        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
        threshold: {
          unit: 'value',
          max: 100,
          values: [3, 6, 12, 30]
        }
      }
    });



    /*===========*
     * LISTENERS *
     *===========*/

    receivedTweetCount
    .onValue(function (data) {
      $('#counter')
      .text(data + " tweets received");
    });

    visualizedTweetCount
    .onValue(function (data) {
      $('#counter-visualized')
      .text(data + " tweets visualized");
    });

    tweetRate
    .onValue(function (data) {
      gauge.load({
        columns: [['data', data]]
      });
    });

    visualizedTweetStream
    .onValue(function (data) {
      $('#tweet__title')
      .text(data.user.name);
      $('#tweet__text')
      .text(data.text);
    });
  });
})(document, document.window, jQuery, Bacon, d3, c3);
