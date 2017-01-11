let jsdom = require('jsdom')
let fs = require('fs')

jsdom.env({
  url: 'https://en.wikipedia.org/wiki/Timeline_of_chemical_element_discoveries',
  scripts: ['https://code.jquery.com/jquery-3.1.1.min.js'],
  done: (err, window) => {
    if (err) console.error(err)
    let $ = window.$

    let tables = $('table.sortable')
    let data = {
      elements: []
    }
    
    for (let i = 0; i < tables.length; i++) {
      let r = 1 //ignore headers
      while (row = tables[i].rows[r++]) {
        if (row.cells[1].textContent) { //skip blank files
          let date = (row.cells[2].textContent.includes('BCE')) 
            ? '1000' : row.cells[2].textContent.substring(0, 4)
          let element = {
            name: row.cells[1].textContent,
            number: row.cells[0].textContent,
            discovery_date: date
          }
    
          data.elements.push(element)
        }
      }
    }
    
    fs.writeFile('discovery.json', JSON.stringify(data), (err) => {
      if (err) throw err
      console.log('File saved')
    })
  }
})