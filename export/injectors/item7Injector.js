
const moment = require('moment');

function itemProgressInjector() {
  /**
   *
   * @param {{}} value
   */
  this.inject = function (value) {
    if (value) {
      if (value.__class && value.__class === 'project@pm-gov-ru') {

        let _indicatorBasicColl = [];
        let _valueBasicColl = [];
        let tzone = "UTC";

        if(value.basicObjs) {
          for (let b = 0; b < value.basicObjs.length; b++) {

            _indicatorBasicColl = value.basicObjs[b].indicatorBasic;
            if  (_indicatorBasicColl && _indicatorBasicColl.length) {
              for (let i = 0; i < _indicatorBasicColl.length; i++) {
                if (_indicatorBasicColl[i].__class === 'indicatorMedia@pm-gov-ru') {
                  let _sumTrueEndProgress = 0;
                  let _sumAllEndProgress = 0;
                  _valueBasicColl = _indicatorBasicColl[i].indicatorValueBasic;
                  if  (_valueBasicColl && _valueBasicColl.length) {
                    for (let j = 0; j < _valueBasicColl.length; j++) {
                      if (_valueBasicColl[j].endProgress === true) {
                        _sumTrueEndProgress++;
                      }
                    }
                    _sumAllEndProgress = _valueBasicColl.length;
                  }
                  let _indicator = value.basicObjs[b].indicatorBasic[i];

                  value.basicObjs[b].indicatorBasic[i]._resultInfoPrint = 
                  'Всего достигнуто за период с ' + moment(_indicator.dateStart).tz(tzone).format('DD.MM.YYYY') +
                  ' по ' + moment(_indicator.dateEnd).tz(tzone).format('DD.MM.YYYY') + ': ' + _sumTrueEndProgress + ' из ' + _sumAllEndProgress;
                }
                if (_indicatorBasicColl[i].__class === 'indicatorText@pm-gov-ru') {
                  let _sumAllPlan = '';
                  let _sumAllFact = '';
                  let _sumTrueEndProgress = 0;
                  let _sumAllEndProgress = 0;
                  _valueBasicColl = _indicatorBasicColl[i].indicatorValueBasic;
                  if  (_valueBasicColl && _valueBasicColl.length) {
                    for (let j = 0; j < _valueBasicColl.length; j++) {
                      if (_valueBasicColl[j].endProgress === true) {
                        _sumTrueEndProgress++;
                      }
                      if (_valueBasicColl[j].plannedValue) {
                        _sumAllPlan += '\n' + _valueBasicColl[j].plannedValue;
                      }
                      if (_valueBasicColl[j].value) {
                        _sumAllFact += '\n' + _valueBasicColl[j].value;
                      }
                    }
                    _sumAllEndProgress = _valueBasicColl.length;
                  }
                  let _indicator = value.basicObjs[b].indicatorBasic[i];

                  value.basicObjs[b].indicatorBasic[i]._resultInfoPrint = 
                  'План: ' + _sumAllPlan + ' ' +
                  '\n\nФакт: ' + _sumAllFact + ' ' +
                  '\n\nВсего достигнуто за период с ' + moment(_indicator.dateStart).tz(tzone).format('DD.MM.YYYY') +
                  ' по ' + moment(_indicator.dateEnd).tz(tzone).format('DD.MM.YYYY') + ': ' + _sumTrueEndProgress + ' из ' + _sumAllEndProgress;
                }
                if (_indicatorBasicColl[i].__class === 'indicatorFinancial@pm-gov-ru' || _indicatorBasicColl[i].__class === 'indicatorDigital@pm-gov-ru') {
                  let _sumAllPlan = 0;
                  let _sumAllFact = 0;
                  let _sumAllProg = 0;
                  let _sumTrueEndProgress = 0;
                  let _sumAllEndProgress = 0;
                  _valueBasicColl = _indicatorBasicColl[i].indicatorValueBasic;
                  if  (_valueBasicColl && _valueBasicColl.length) {
                    for (let j = 0; j < _valueBasicColl.length; j++) {
                      if (_valueBasicColl[j].endProgress === true) {
                        _sumTrueEndProgress++;
                      }
                      _sumAllPlan += _valueBasicColl[j].plannedValue;
                      _sumAllFact += _valueBasicColl[j].value;
                      _sumAllProg += _valueBasicColl[j].desiredValue;
                    }
                    _sumAllEndProgress = _valueBasicColl.length;
                  }
                  let _indicator = value.basicObjs[b].indicatorBasic[i];

                  if (_indicator.measureUnit && _indicator.measureUnit.__string) {
                    _indicator._measureUnitString = _indicator.measureUnit.__string;
                  } else {
                    _indicator._measureUnitString = '';
                  }
                  value.basicObjs[b].indicatorBasic[i]._resultInfoPrint =
                  'План: ' + _sumAllPlan + ' ' + _indicator._measureUnitString +
                  '\nФакт: ' + _sumAllFact + ' ' + _indicator._measureUnitString +
                  '\nПрогноз: ' + _sumAllProg + ' ' + _indicator._measureUnitString +
                  '\nВсего достигнуто за период с ' + moment(_indicator.dateStart).tz(tzone).format('DD.MM.YYYY') +
                  ' по ' + moment(_indicator.dateEnd).tz(tzone).format('DD.MM.YYYY') + ': ' + _sumTrueEndProgress + ' из ' + _sumAllEndProgress;
                }
              }
            }
          }
        }

        _indicatorBasicColl = value.indicatorBasic;
        if  (_indicatorBasicColl && _indicatorBasicColl.length) {
          for (let i = 0; i < _indicatorBasicColl.length; i++) {

            let _sumPeriodY1 = 0;
            let _sumPeriodY2 = 0;
            let _sumPeriodY3 = 0;
            let _sumPeriodY4 = 0;
            let _sumPeriodY5 = 0;
            let _sumPeriodY6 = 0;
            let _sumPeriodY7 = 0;
            _valueBasicColl = _indicatorBasicColl[i].indicatorValueBasic;
            if  (_valueBasicColl && _valueBasicColl.length) {
              for (let j = 0; j < _valueBasicColl.length; j++) {

                if (_valueBasicColl[j].dateStart && value.datePlannedStart) {
                  let _dateStartPeriodY1 = moment(value.datePlannedStart).tz(tzone).format('YYYY');
                  let _dateStartPeriodY2 = moment(value.datePlannedStart).tz(tzone).add(1, 'years').format('YYYY');
                  let _dateStartPeriodY3 = moment(value.datePlannedStart).tz(tzone).add(2, 'years').format('YYYY');
                  let _dateStartPeriodY4 = moment(value.datePlannedStart).tz(tzone).add(3, 'years').format('YYYY');
                  let _dateStartPeriodY5 = moment(value.datePlannedStart).tz(tzone).add(4, 'years').format('YYYY');
                  let _dateStartPeriodY6 = moment(value.datePlannedStart).tz(tzone).add(5, 'years').format('YYYY');
                  let _dateStartPeriodY7 = moment(value.datePlannedStart).tz(tzone).add(6, 'years').format('YYYY');
                  let dateStartValueBasic = moment(_valueBasicColl[j].dateStart).tz(tzone).format('YYYY');

                  if (dateStartValueBasic === _dateStartPeriodY1) {
                    _sumPeriodY1 += _valueBasicColl[j].plannedValue;
                  }
                  if (dateStartValueBasic === _dateStartPeriodY2) {
                    _sumPeriodY2 += _valueBasicColl[j].plannedValue;
                  }
                  if (dateStartValueBasic === _dateStartPeriodY3) {
                    _sumPeriodY3 += _valueBasicColl[j].plannedValue;
                  }
                  if (dateStartValueBasic === _dateStartPeriodY4) {
                    _sumPeriodY4 += _valueBasicColl[j].plannedValue;
                  }
                  if (dateStartValueBasic === _dateStartPeriodY5) {
                    _sumPeriodY5 += _valueBasicColl[j].plannedValue;
                  }
                  if (dateStartValueBasic === _dateStartPeriodY6) {
                    _sumPeriodY6 += _valueBasicColl[j].plannedValue;
                  }
                  if (dateStartValueBasic === _dateStartPeriodY7) {
                    _sumPeriodY7 += _valueBasicColl[j].plannedValue;
                  }
                }

              }
            }
            value.indicatorBasic[i]._sumPeriodY1 = _sumPeriodY1;
            value.indicatorBasic[i]._sumPeriodY2 = _sumPeriodY2;
            value.indicatorBasic[i]._sumPeriodY3 = _sumPeriodY3;
            value.indicatorBasic[i]._sumPeriodY4 = _sumPeriodY4;
            value.indicatorBasic[i]._sumPeriodY5 = _sumPeriodY5;
            value.indicatorBasic[i]._sumPeriodY6 = _sumPeriodY6;
            value.indicatorBasic[i]._sumPeriodY7 = _sumPeriodY7;
          }
        }

        let _sumByProjY1 = 0;
        let _sumByProjY2 = 0;
        let _sumByProjY3 = 0;
        let _sumByProjY4 = 0;
        let _sumByProjY5 = 0;
        let _sumByProjY6 = 0;
        let _sumByProjY7 = 0;
        let _budgetTypeByProj = {
          "data": [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0]
          ],
          "typeBudget": [
            "federal",
            "vnebudgetFond",
            "krai",
            "munic",
            "vnebudget"
          ],
          "nameTypeBudget": [
            "Федеральный бюджет",
            "Бюджеты государственных внебюджетных фондов",
            "Областной бюджет",
            "Местные бюджеты",
            "Внебюджетные источники"
          ],
          "byBudget": []
        };
        _indicatorBasicColl = value.indicatorBudget;
        if  (_indicatorBasicColl && _indicatorBasicColl.length) {
          for (let i = 0; i < _indicatorBasicColl.length; i++) {

            let _sumByBudgetY1 = 0;
            let _sumByBudgetY2 = 0;
            let _sumByBudgetY3 = 0;
            let _sumByBudgetY4 = 0;
            let _sumByBudgetY5 = 0;
            let _sumByBudgetY6 = 0;
            let _sumByBudgetY7 = 0;
            let indexBudget = _budgetTypeByProj.typeBudget.indexOf(_indicatorBasicColl[i].budgetType);
            let _name = '';
            let _plan = '';
            if (_indicatorBasicColl[i].obj) {
              _name = _indicatorBasicColl[i].obj.name;
              _plan = _indicatorBasicColl[i].obj.plan
            }
            let _budgetTypeByBudget = {
              "name" : _name,
              "plan" : _plan,
              "_sumByBudgetY1": 0,
              "_sumByBudgetY2": 0,
              "_sumByBudgetY3": 0,
              "_sumByBudgetY4": 0,
              "_sumByBudgetY5": 0,
              "_sumByBudgetY6": 0,
              "_sumByBudgetY7": 0,
              "_sumByBudgetAll": 0,
              "data": [
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0]
              ],
              "typeBudget": [
                "federal",
                "vnebudgetFond",
                "krai",
                "munic",
                "vnebudget"
              ],
              "nameTypeBudget": [
                "Федеральный бюджет",
                "Бюджеты государственных внебюджетных фондов",
                "Областной бюджет",
                "Местные бюджеты",
                "Внебюджетные источники"
              ]
            };
            let _bgColl = _budgetTypeByProj.byBudget;
            if (_bgColl.length === 0) {
              _bgColl.push(_budgetTypeByBudget);
            } else {
              let count = 0;
              for (let bg = 0; bg < _bgColl.length; bg++) {
                if (_bgColl[bg].name && _bgColl[bg].name === _budgetTypeByBudget.name) {
                  count++;
                }
              }
              if (count === 0) {
                _bgColl.push(_budgetTypeByBudget);
              }
            }

            _valueBasicColl = _indicatorBasicColl[i].indicatorValueBasic;
            if  (_valueBasicColl && _valueBasicColl.length) {
              for (let j = 0; j < _valueBasicColl.length; j++) {

                if (_valueBasicColl[j].dateStart && value.datePlannedStart) {
                  let _dateStartPeriodY1 = moment(value.datePlannedStart).tz(tzone).format('YYYY');
                  let _dateStartPeriodY2 = moment(value.datePlannedStart).tz(tzone).add(1, 'years').format('YYYY');
                  let _dateStartPeriodY3 = moment(value.datePlannedStart).tz(tzone).add(2, 'years').format('YYYY');
                  let _dateStartPeriodY4 = moment(value.datePlannedStart).tz(tzone).add(3, 'years').format('YYYY');
                  let _dateStartPeriodY5 = moment(value.datePlannedStart).tz(tzone).add(4, 'years').format('YYYY');
                  let _dateStartPeriodY6 = moment(value.datePlannedStart).tz(tzone).add(5, 'years').format('YYYY');
                  let _dateStartPeriodY7 = moment(value.datePlannedStart).tz(tzone).add(6, 'years').format('YYYY');
                  let dateStartValueBasic = moment(_valueBasicColl[j].dateStart).tz(tzone).format('YYYY');

                  if (dateStartValueBasic === _dateStartPeriodY1) {
                    if (indexBudget >= 0) {
                      for (let bg = 0; bg < _bgColl.length; bg++) {
                        if (_bgColl[bg].name && _bgColl[bg].name === _budgetTypeByBudget.name) {
                          _bgColl[bg].data[indexBudget][0] += _valueBasicColl[j].desiredValue;
                        }
                      }
                      _budgetTypeByProj.data[indexBudget][0] += _valueBasicColl[j].desiredValue;
                    }
                    _sumByProjY1 += _valueBasicColl[j].desiredValue;
                    _sumByBudgetY1 += _valueBasicColl[j].desiredValue;
                  }
                  if (dateStartValueBasic === _dateStartPeriodY2) {
                    if (indexBudget >= 0) {
                      for (let bg = 0; bg < _bgColl.length; bg++) {
                        if (_bgColl[bg].name && _bgColl[bg].name === _budgetTypeByBudget.name) {
                          _bgColl[bg].data[indexBudget][1] += _valueBasicColl[j].desiredValue;
                        }
                      }
                      _budgetTypeByProj.data[indexBudget][1] += _valueBasicColl[j].desiredValue;
                    }
                    _sumByProjY2 += _valueBasicColl[j].desiredValue;
                    _sumByBudgetY2 += _valueBasicColl[j].desiredValue;
                  }
                  if (dateStartValueBasic === _dateStartPeriodY3) {
                    if (indexBudget >= 0) {
                      for (let bg = 0; bg < _bgColl.length; bg++) {
                        if (_bgColl[bg].name && _bgColl[bg].name === _budgetTypeByBudget.name) {
                          _bgColl[bg].data[indexBudget][2] += _valueBasicColl[j].desiredValue;
                        }
                      }
                      _budgetTypeByProj.data[indexBudget][2] += _valueBasicColl[j].desiredValue;
                    }
                    _sumByProjY3 += _valueBasicColl[j].desiredValue;
                    _sumByBudgetY3 += _valueBasicColl[j].desiredValue;
                  }
                  if (dateStartValueBasic === _dateStartPeriodY4) {
                    if (indexBudget >= 0) {
                      for (let bg = 0; bg < _bgColl.length; bg++) {
                        if (_bgColl[bg].name && _bgColl[bg].name === _budgetTypeByBudget.name) {
                          _bgColl[bg].data[indexBudget][3] += _valueBasicColl[j].desiredValue;
                        }
                      }
                      _budgetTypeByProj.data[indexBudget][3] += _valueBasicColl[j].desiredValue;
                    }
                    _sumByProjY4 += _valueBasicColl[j].desiredValue;
                    _sumByBudgetY4 += _valueBasicColl[j].desiredValue;
                  }
                  if (dateStartValueBasic === _dateStartPeriodY5) {
                    if (indexBudget >= 0) {
                      for (let bg = 0; bg < _bgColl.length; bg++) {
                        if (_bgColl[bg].name && _bgColl[bg].name === _budgetTypeByBudget.name) {
                          _bgColl[bg].data[indexBudget][4] += _valueBasicColl[j].desiredValue;
                        }
                      }
                      _budgetTypeByProj.data[indexBudget][4] += _valueBasicColl[j].desiredValue;
                    }
                    _sumByProjY5 += _valueBasicColl[j].desiredValue;
                    _sumByBudgetY5 += _valueBasicColl[j].desiredValue;
                  }
                  if (dateStartValueBasic === _dateStartPeriodY6) {
                    if (indexBudget >= 0) {
                      for (let bg = 0; bg < _bgColl.length; bg++) {
                        if (_bgColl[bg].name && _bgColl[bg].name === _budgetTypeByBudget.name) {
                          _bgColl[bg].data[indexBudget][5] += _valueBasicColl[j].desiredValue;
                        }
                      }
                      _budgetTypeByProj.data[indexBudget][5] += _valueBasicColl[j].desiredValue;
                    }
                    _sumByProjY6 += _valueBasicColl[j].desiredValue;
                    _sumByBudgetY6 += _valueBasicColl[j].desiredValue;
                  }
                  if (dateStartValueBasic === _dateStartPeriodY7) {
                    if (indexBudget >= 0) {
                      for (let bg = 0; bg < _bgColl.length; bg++) {
                        if (_bgColl[bg].name && _bgColl[bg].name === _budgetTypeByBudget.name) {
                          _bgColl[bg].data[indexBudget][6] += _valueBasicColl[j].desiredValue;
                        }
                      }
                      _budgetTypeByProj.data[indexBudget][6] += _valueBasicColl[j].desiredValue;
                    }
                    _sumByProjY7 += _valueBasicColl[j].desiredValue;
                    _sumByBudgetY7 += _valueBasicColl[j].desiredValue;
                  }
                }

              }
            }

            

            for (let bg = 0; bg < _bgColl.length; bg++) {
              if (_bgColl[bg].name && _bgColl[bg].name === _budgetTypeByBudget.name) {
                _bgColl[bg]._sumByBudgetY1 += _sumByBudgetY1;
                _bgColl[bg]._sumByBudgetY2 += _sumByBudgetY2;
                _bgColl[bg]._sumByBudgetY3 += _sumByBudgetY3;
                _bgColl[bg]._sumByBudgetY4 += _sumByBudgetY4;
                _bgColl[bg]._sumByBudgetY5 += _sumByBudgetY5;
                _bgColl[bg]._sumByBudgetY6 += _sumByBudgetY6;
                _bgColl[bg]._sumByBudgetY7 += _sumByBudgetY7;
                _bgColl[bg]._sumByBudgetAll = _bgColl[bg]._sumByBudgetY1 + _bgColl[bg]._sumByBudgetY2 + _bgColl[bg]._sumByBudgetY3 + _bgColl[bg]._sumByBudgetY4 + _bgColl[bg]._sumByBudgetY5 + _bgColl[bg]._sumByBudgetY6 + _bgColl[bg]._sumByBudgetY7;
                for (let dt = 0; dt <  _bgColl[bg].data.length; dt++) {
                  _bgColl[bg].data[dt][7] = _bgColl[bg].data[dt][0] + _bgColl[bg].data[dt][1] + _bgColl[bg].data[dt][2] + _bgColl[bg].data[dt][3]+ _bgColl[bg].data[dt][4] +_bgColl[bg].data[dt][5] + _bgColl[bg].data[dt][6];
                }
              }
            }
            
            _budgetTypeByProj.byBudget = _bgColl;

            value.indicatorBudget[i]._sumByBudgetY1 = _sumByBudgetY1;
            value.indicatorBudget[i]._sumByBudgetY2 = _sumByBudgetY2;
            value.indicatorBudget[i]._sumByBudgetY3 = _sumByBudgetY3;
            value.indicatorBudget[i]._sumByBudgetY4 = _sumByBudgetY4;
            value.indicatorBudget[i]._sumByBudgetY5 = _sumByBudgetY5;
            value.indicatorBudget[i]._sumByBudgetY6 = _sumByBudgetY6;
            value.indicatorBudget[i]._sumByBudgetY7 = _sumByBudgetY7;
            value.indicatorBudget[i]._sumByBudgetAll = _sumByBudgetY1 + _sumByBudgetY2 + _sumByBudgetY3 + _sumByBudgetY4 + _sumByBudgetY5 + _sumByBudgetY6 + _sumByBudgetY7;
          }
        }
        value._sumByProjY1 = _sumByProjY1;
        value._sumByProjY2 = _sumByProjY2;
        value._sumByProjY3 = _sumByProjY3;
        value._sumByProjY4 = _sumByProjY4;
        value._sumByProjY5 = _sumByProjY5;
        value._sumByProjY6 = _sumByProjY6;
        value._sumByProjY7 = _sumByProjY7;
        value._sumByProjAll = _sumByProjY1 + _sumByProjY2 + _sumByProjY3 + _sumByProjY4 + _sumByProjY5 + _sumByProjY6 + _sumByProjY7;

        for (let i = 0; i <  _budgetTypeByProj.data.length; i++) {
          _budgetTypeByProj.data[i][7] = _budgetTypeByProj.data[i][0] + _budgetTypeByProj.data[i][1] + _budgetTypeByProj.data[i][2] + _budgetTypeByProj.data[i][3]+ _budgetTypeByProj.data[i][4] +_budgetTypeByProj.data[i][5] + _budgetTypeByProj.data[i][6];
        }
        value._budgetTypeByProj = _budgetTypeByProj;
      }
    }
    return value;
  };
}

module.exports = itemProgressInjector;
