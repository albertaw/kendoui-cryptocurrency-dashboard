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
    dataSource: dataSource,
    columns: [
      {field: 'Market', width: '20%', template: "<strong>#: Market # </strong>"},
      {field: 'LastPrice'},
      {field: 'Volume'}
    ]
  }
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

  var btcData = getDataSource('https://www.cryptopia.co.nz/api/GetMarkets/BTC');
	var btcGridOptions = getGridOptions(btcData);
	$('#btc-grid').kendoGrid(btcGridOptions);

	var usdtData = getDataSource('https://www.cryptopia.co.nz/api/GetMarkets/USDT');
	var usdtGridOptions = getGridOptions(usdtData);
	$('#usdt-grid').kendoGrid(usdtGridOptions);

	var ltcData = getDataSource('https://www.cryptopia.co.nz/api/GetMarkets/LTC');
	var ltcGridOptions = getGridOptions(ltcData);
	$('#ltc-grid').kendoGrid(ltcGridOptions);
});