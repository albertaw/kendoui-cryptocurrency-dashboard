var gridDataSource = new kendo.data.DataSource({
  transport: {
    read: {
      url: 'https://www.cryptopia.co.nz/api/GetMarkets/BTC',
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

var chartDataSource = new kendo.data.DataSource({
  transport: {
    read: {
      url: 'https://www.cryptopia.co.nz/api/GetMarketHistory/DASH_USDT',
      dataType: 'json',
      data: {
        hours: 48,
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

$(document).ready(function(){
	$('#splitter').kendoSplitter({
  	panes: [{size: '40%', collapsible: true}, {collapsible: true}]
  });
  $('#tabs').kendoTabStrip({
    value: 'BTC',
    dataTextField: 'label',
    dataContentField: 'content',
    dataSource: [
      {label: 'BTC', content: '<h4>BTC Grid</h4>'},
      {label: 'USDT', content: '<h4>USDT Grid</h4>'},
      {label: 'LTC', content: '<h4>LTC Grid</h4>'}
    ]
  });
  $('#picker').kendoDateTimePicker({
  	dateInput: true,
    format: 'MM/dd/yyyy h tt',
    timeFormat: 'h:mm tt',
    interval: 60
  });
  $('#button-group').kendoButtonGroup({
  	items: [
      {text: '1d'},
      {text: '1w'},
      {text: '1m'},
      {text: '3m'}
    ]
  });
});