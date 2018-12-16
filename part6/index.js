var tradingPair;

function getDataSource(url) {
  var dataSource = new kendo.data.DataSource({
    transport: {
      read: {
        url: url,
        dataType: 'json'
      }
    },
    schema: {
      parse: function(response){
        return response.Data.map(function(item){
          var label = item.Label;
          var end = label.indexOf('/');

          return {
            Label: item.Label,
            Market: label.slice(0, end),
            LastPrice: item.LastPrice.toFixed(8), 
            Volume: item.Volume.toFixed(8)
          };
        });
      }
    }
  });
  return dataSource;
}

function getGridOptions(dataSource){
  return {
    selectable: true,
    sortable: true,
    navigatable: true,
    dataSource: dataSource,
    columns: [
      {field: 'Market', width: '20%', template: "<strong>#: Market # </strong>"},
      {field: 'LastPrice'},
      {field: 'Volume'}
    ], 
    navigate: function onGridNavigate(e){
      var row = e.element.closest('tr');
      var dataItem = this.dataItem(row);
      $('#trading-pair').text(dataItem.Label);
      
      var button = $('#button-group').data('kendoButtonGroup');
      button.select(2);

      var hours = 24;
      tradingPair = dataItem.Label.replace('/', '_');
      updateChart(tradingPair, hours);
    }
  }
}

function updateChart(tradingPair, hours) {
  var dataSource = getChartDataSource(tradingPair, hours);
  var chart = $('#chart').data('kendoChart');
  chart.setDataSource(dataSource);
}

function getChartDataSource(tradingPair, hours) {
  var dataSource = new kendo.data.DataSource({
    transport: {
      read: {
        url: 'https://www.cryptopia.co.nz/api/GetMarketHistory/' + tradingPair,
        dataType: 'json',
        data: {
          hours: hours,
        }
      }
    },
    schema: {
      parse: function(response){
        if (response.Data == null) {
          return [];
        } else {
          return response.Data.map(function(item){
            return {
              Label: item.Label,
              Price: item.Price,
              Timestamp: item.Timestamp
            };
          });
        }
      }
    }
  });
  return dataSource;
}

$(document).ready(function(){
	$('#splitter').kendoSplitter({
  	panes: [{size: '40%', collapsible: true}, {collapsible: true}]
  });
  
  $('#tabs').kendoTabStrip({
	  value: 'BTC',
	  dataTextField: 'label',
	  dataContentField: 'content',
	  dataSource: [
	    {label: 'BTC', content: '<div id="btc-grid" class="grid"></div>'},
	    {label: 'USDT', content: '<div id="usdt-grid" class="grid"></div>'},
	    {label: 'LTC', content: '<div id="ltc-grid" class="grid"></div>'}
	  ]
	});
  
  $('#picker').kendoDateTimePicker({
    dateInput: true,
    format: 'MM/dd/yyyy h tt',
    timeFormat: 'h:mm tt',
    interval: 60,
    value: new Date(),
    disableDates: function(date) {
      var now = new Date();
      var year = now - 3.154e10;
      if (date > now || date < year) {
        return true;
      } else {
        return false;
      }
    },
    change: function() {
      var time = this.value().getTime();
      var now = new Date().getTime();
      var hours = Math.round((now - time) / 3.6e6)
      updateChart(tradingPair, hours);
    }
  });
  
  $('#button-group').kendoButtonGroup({
    items: [
      {text: '6h'},
      {text: '12h'},
      {text: '1d'},
      {text: '2d'}
    ],
    select: function onButtonSelect(e) {
      var index = this.current().index();
      var hours;
      switch(index){
        case 0: 
          hours = 6;
          break;
        case 1:
          hours = 12;
          break;
        case 2:
          hours = 24;
          break;
        case 3:
          hours = 48;
          break;
        default:
          hours = 24;
      }
      updateChart(tradingPair, hours);
    }
  });

  var btcData = getDataSource('https://www.cryptopia.co.nz/api/GetMarkets/BTC');
	var btcGridOptions = getGridOptions(btcData);
	$('#btc-grid').kendoGrid(btcGridOptions);

	var usdtData = getDataSource('https://www.cryptopia.co.nz/api/GetMarkets/USDT');
	var usdtGridOptions = getGridOptions(usdtData);
	$('#usdt-grid').kendoGrid(usdtGridOptions);

	var ltcData = getDataSource('https://www.cryptopia.co.nz/api/GetMarkets/LTC');
	var ltcGridOptions = getGridOptions(ltcData);
	$('#ltc-grid').kendoGrid(ltcGridOptions);

  $('#chart').kendoChart({
    tooltip: {
      visible: true,
      template: '#: value.y #'
    },
    legend: {
      position: 'bottom'
    },
    series: [{
      xField: 'Timestamp',
      yField: 'Price',
      type: 'scatter',
    }],
     xAxis: {
      title: {
        text: 'Time'
      },
      labels: {
        visible: false
      }
    },
    yAxis: {
      title: {
        text: 'Price'
      }
    }
  });
});