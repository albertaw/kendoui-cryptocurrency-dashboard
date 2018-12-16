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