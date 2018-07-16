'use strict';

const vscode = require('vscode');
const {parseJSON} = require('./utils');
const {symbolReportPath, hoverPath} = require('./urls');
const {renderModule, renderFunction, renderInstance} = require('./html-utils');
const {reportFromHover} = require('./data-utils');
const Plan = require('./plan');
let Kite;

module.exports = {
  render(id) {
    if (!Kite) { Kite = require('./kite'); }
    const path = symbolReportPath(id);

    return Plan.queryPlan()
    .then(() => Kite.request({path}))
    .then(report => parseJSON(report))
    .then(report => {
      if (report.symbol && report.symbol.id === '') { report.symbol.id = id; }
      return report;
    })
    .then(data => this.renderData(data))
  },

  renderFromRange(document, range) {
    if (!Kite) { Kite = require('./kite'); }

    const [start, end] = range;
    const path = hoverPath(document, {
      line: Math.round((start.line + end.line) / 2), 
      character: Math.round((start.character + end.character) / 2)
    });

    return Plan.queryPlan()
    .then(() => Kite.request({path}))
    .then(report => parseJSON(report))
    .then(data => reportFromHover(data))
    .then(data => this.renderData(data))
    .catch(err => console.log(err.message))
  },
  
  renderFromPosition(document, position) {
    if (!Kite) { Kite = require('./kite'); }

    
    const path = hoverPath(document, position);
    
    return Plan.queryPlan()
    .then(() => Kite.request({path}))
    .then(report => parseJSON(report))
    .then(data => reportFromHover(data))
    .then(data => this.renderData(data))
    .catch(err => console.log(err.message))
  },

  renderData(data) {
    try {
      const [value] = data.symbol.value;
      switch(value.kind) {
        case 'module':
        case 'type':
          return renderModule(data);
        case 'function': 
          return renderFunction(data);
        case 'instance': 
        case 'unknown': 
          return renderInstance(data);
        default:
          return '';
      }
    } catch (e) {
      console.log(e.stack);
    }
  }
}