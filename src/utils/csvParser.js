export const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',').map(value => value.trim());
    const trade = {};
    
    headers.forEach((header, index) => {
      switch(header) {
        case 'Entry Date':
          trade.entryDate = values[index];
          break;
        case 'Ticker':
          trade.ticker = values[index];
          break;
        case 'Type':
          trade.type = values[index].toLowerCase();
          break;
        case 'Result':
          trade.result = values[index].toLowerCase();
          break;
        case 'Option':
          trade.option = values[index];
          break;
        case 'Source':
          trade.source = values[index];
          break;
        case 'Reasoning':
          trade.reasoning = values[index];
          break;
        case 'Entry Price':
          trade.entryPrice = values[index];
          break;
        case 'Exit Price':
          trade.exitPrice = values[index];
          break;
        case 'Profit':
          trade.profit = values[index];
          break;
        case 'Exit Date':
          trade.exitDate = values[index];
          break;
        case 'Notes':
          trade.notes = values[index];
          break;
      }
    });
    
    return trade;
  });
}; 