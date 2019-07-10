
const moment = require('moment');

function programPassportInjector() {
  /**
   *
   * @param {{}} value
   */
  this.inject = function (value) {
    if (value) {
      if (value.__class && value.__class === 'program@pm-gov-ru') {

        function getSumByIndicatorBasic(indicatorValueBasic, sumPeriod, addStep, formatEq) {
          if  (indicatorValueBasic && indicatorValueBasic.length) {
            for (let indexInd = 0; indexInd < indicatorValueBasic.length; indexInd++) {
              if (indicatorValueBasic[indexInd].dateStart && value.datePlannedStart) {
                for (let s = 0; s < sumPeriod.length; s++)
                {
                  let _dateStartPeriod = moment(value.datePlannedStart).tz(tzone).add(s, addStep).format(formatEq);
                  let dateStartValueBasic = moment(indicatorValueBasic[indexInd].dateStart).tz(tzone).format(formatEq);
                  if (dateStartValueBasic === _dateStartPeriod) {
                    sumPeriod[s] += indicatorValueBasic[indexInd].plannedValue;
                  }
                }
              }
            }
          }
          return sumPeriod; 
        }

        function getIndicatorByPurposes(purposesColl) {
          if  (purposesColl && purposesColl.length) {
            for (let p = 0; p < purposesColl.length; p++) {
              let _indicatorByPurposes = {
                name: '',
                byIndicators: []
              };
              _indicatorByPurposes.name = purposesColl[p].name;
              let _purposeIndicatorColl = purposesColl[p].purposeIndicator;
  
                if  (_purposeIndicatorColl && _purposeIndicatorColl.length) {
                  for (let i = 0; i < _purposeIndicatorColl.length; i++) {
                    let _indicatorByPurpose = {
                      name: '',
                      typeIndicatorprint: '',
                      defPlanValue: '',
                      datebasicValue: '',
                      sumPeriodY1: 0,
                      sumPeriodY2: 0,
                      sumPeriodY3: 0,
                      sumPeriodY4: 0,
                      sumPeriodY5: 0,
                      sumPeriodY6: 0,
                      sumPeriodY7: 0
                    };
                    if (_purposeIndicatorColl[i] && _purposeIndicatorColl[i].indicator) {
                      _indicatorByPurpose.name = _purposeIndicatorColl[i].indicator.__string;
                      _indicatorByPurpose.typeIndicatorprint = _purposeIndicatorColl[i].indicator.typeIndicatorprint;
                      if (_purposeIndicatorColl[i].indicator.baseValuePrint > 0) {
                        _indicatorByPurpose.baseValuePrint = _purposeIndicatorColl[i].indicator.baseValuePrint;
                        _indicatorByPurpose.baseDatePrint = moment(_purposeIndicatorColl[i].indicator.baseDatePrint).tz(tzone).format('DD.MM.YYYY');
                      }
  
                      let _sumPeriodY = [0,0,0,0,0,0,0];
                      _sumPeriodY = getSumByIndicatorBasic(_purposeIndicatorColl[i].indicator.indicatorValueBasic, _sumPeriodY, 'years', 'YYYY');
                      
                      _indicatorByPurpose.sumPeriodY1 += _sumPeriodY[0];
                      _indicatorByPurpose.sumPeriodY2 += _sumPeriodY[1];
                      _indicatorByPurpose.sumPeriodY3 += _sumPeriodY[2];
                      _indicatorByPurpose.sumPeriodY4 += _sumPeriodY[3];
                      _indicatorByPurpose.sumPeriodY5 += _sumPeriodY[4];
                      _indicatorByPurpose.sumPeriodY6 += _sumPeriodY[5];
                      _indicatorByPurpose.sumPeriodY7 += _sumPeriodY[6];
                    }
                    _indicatorByPurposes.byIndicators.push(_indicatorByPurpose);
                  }
                }
              _ipColl.push(_indicatorByPurposes);
              getIndicatorByPurposes(purposesColl[p].purposes);
            }
          }
        }

        function correctSumByIndicatorBudget(budgetByProgram, correctBudget, valueFix) {
          
          for (let i = 0; i < budgetByProgram.data.length; i++) {
            let dataLength = budgetByProgram.data[i].length;

            for (let j = 0; j < dataLength-1; j++) {
              budgetByProgram.data[i][dataLength-1] += budgetByProgram.data[i][j];
            }
            for (let j = 0; j < dataLength; j++) {
              budgetByProgram.data[i][j] = (budgetByProgram.data[i][j] / correctBudget).toFixed(valueFix);
            }
          }

          budgetByProgram._sumAll = budgetByProgram._sumY1 + budgetByProgram._sumY2 + budgetByProgram._sumY3 + budgetByProgram._sumY4 + budgetByProgram._sumY5 + budgetByProgram._sumY6 + budgetByProgram._sumY7;

          budgetByProgram._sumY1 = (budgetByProgram._sumY1 / correctBudget).toFixed(valueFix);
          budgetByProgram._sumY2 = (budgetByProgram._sumY2 / correctBudget).toFixed(valueFix);
          budgetByProgram._sumY3 = (budgetByProgram._sumY3 / correctBudget).toFixed(valueFix);
          budgetByProgram._sumY4 = (budgetByProgram._sumY4 / correctBudget).toFixed(valueFix);
          budgetByProgram._sumY5 = (budgetByProgram._sumY5 / correctBudget).toFixed(valueFix);
          budgetByProgram._sumY6 = (budgetByProgram._sumY6 / correctBudget).toFixed(valueFix);
          budgetByProgram._sumY7 = (budgetByProgram._sumY7 / correctBudget).toFixed(valueFix);
          budgetByProgram._sumAll = (budgetByProgram._sumAll / correctBudget).toFixed(valueFix);

          return budgetByProgram;
        }

        let _ipColl = [];
        let tzone = "UTC";

        getIndicatorByPurposes(value.purposes);

        value._indicatorBasicByPurposes = _ipColl;

        if (value.project) {
          ///
          let _budgetTypeByProgram = {
            "_sumY1": 0,
            "_sumY2": 0,
            "_sumY3": 0,
            "_sumY4": 0,
            "_sumY5": 0,
            "_sumY6": 0,
            "_sumY7": 0,
            "_sumAll": 0,
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
            "byProject": []
          };

          for (let p = 0; p < value.project.length; p++) {
///
            let _budgetTypeByProject = {
              "name" : value.project[p].name,
              "_sumY1": 0,
              "_sumY2": 0,
              "_sumY3": 0,
              "_sumY4": 0,
              "_sumY5": 0,
              "_sumY6": 0,
              "_sumY7": 0,
              "_sumAll": 0,
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
            let _indicatorBasicColl = value.project[p].indicatorBudget;
            if (_indicatorBasicColl && _indicatorBasicColl.length) {
              for (let i = 0; i < _indicatorBasicColl.length; i++) {
                
                let indexBudget = _budgetTypeByProgram.typeBudget.indexOf(_indicatorBasicColl[i].budgetType);
                let _valueBasicColl = _indicatorBasicColl[i].indicatorValueBasic;
                
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
                          _budgetTypeByProject.data[indexBudget][0] += _valueBasicColl[j].desiredValue;
                          _budgetTypeByProgram.data[indexBudget][0] += _valueBasicColl[j].desiredValue;
                        }
                        _budgetTypeByProject._sumY1 += _valueBasicColl[j].desiredValue;
                        _budgetTypeByProgram._sumY1 += _valueBasicColl[j].desiredValue;
                      }
                      if (dateStartValueBasic === _dateStartPeriodY2) {
                        if (indexBudget >= 0) {
                          _budgetTypeByProject.data[indexBudget][1] += _valueBasicColl[j].desiredValue;
                          _budgetTypeByProgram.data[indexBudget][1] += _valueBasicColl[j].desiredValue;
                        }
                        _budgetTypeByProject._sumY2 += _valueBasicColl[j].desiredValue;
                        _budgetTypeByProgram._sumY2 += _valueBasicColl[j].desiredValue;
                      }
                      if (dateStartValueBasic === _dateStartPeriodY3) {
                        if (indexBudget >= 0) {
                          _budgetTypeByProject.data[indexBudget][2] += _valueBasicColl[j].desiredValue;
                          _budgetTypeByProgram.data[indexBudget][2] += _valueBasicColl[j].desiredValue;
                        }
                        _budgetTypeByProject._sumY3 += _valueBasicColl[j].desiredValue;
                        _budgetTypeByProgram._sumY3 += _valueBasicColl[j].desiredValue;
                      }
                      if (dateStartValueBasic === _dateStartPeriodY4) {
                        if (indexBudget >= 0) {
                          _budgetTypeByProject.data[indexBudget][3] += _valueBasicColl[j].desiredValue;
                          _budgetTypeByProgram.data[indexBudget][3] += _valueBasicColl[j].desiredValue;
                        }
                        _budgetTypeByProject._sumY4 += _valueBasicColl[j].desiredValue;
                        _budgetTypeByProgram._sumY4 += _valueBasicColl[j].desiredValue;
                      }
                      if (dateStartValueBasic === _dateStartPeriodY5) {
                        if (indexBudget >= 0) {
                          _budgetTypeByProject.data[indexBudget][4] += _valueBasicColl[j].desiredValue;
                          _budgetTypeByProgram.data[indexBudget][4] += _valueBasicColl[j].desiredValue;
                        }
                        _budgetTypeByProject._sumY5 += _valueBasicColl[j].desiredValue;
                        _budgetTypeByProgram._sumY5 += _valueBasicColl[j].desiredValue;
                      }
                      if (dateStartValueBasic === _dateStartPeriodY6) {
                        if (indexBudget >= 0) {
                          _budgetTypeByProject.data[indexBudget][5] += _valueBasicColl[j].desiredValue;
                          _budgetTypeByProgram.data[indexBudget][5] += _valueBasicColl[j].desiredValue;
                        }
                        _budgetTypeByProject._sumY6 += _valueBasicColl[j].desiredValue;
                        _budgetTypeByProgram._sumY6 += _valueBasicColl[j].desiredValue;
                      }
                      if (dateStartValueBasic === _dateStartPeriodY7) {
                        if (indexBudget >= 0) {
                          _budgetTypeByProject.data[indexBudget][6] += _valueBasicColl[j].desiredValue;
                          _budgetTypeByProgram.data[indexBudget][6] += _valueBasicColl[j].desiredValue;
                        }
                        _budgetTypeByProject._sumY7 += _valueBasicColl[j].desiredValue;
                        _budgetTypeByProgram._sumY7 += _valueBasicColl[j].desiredValue;
                      }
                    }
                  }
                }
              }
            }
            _budgetTypeByProgram.byProject.push(_budgetTypeByProject);

///
            let _problemRegColl = value.project[p].problemReg;
            if (_problemRegColl && _problemRegColl.length) {
              for (let b = 0; b < _problemRegColl.length; b++) {

                let _indicatorBasicColl = _problemRegColl[b].indicatorBasic;
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
                      let _indicator = value.project[p].problemReg[b].indicatorBasic[i];

                      value.project[p].problemReg[b].indicatorBasic[i]._resultInfoPrint = 
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
                      let _indicator = value.project[p].problemReg[b].indicatorBasic[i];

                      value.project[p].problemReg[b].indicatorBasic[i]._resultInfoPrint = 
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
                      let _indicator = value.project[p].problemReg[b].indicatorBasic[i];

                      if (_indicator.measureUnit && _indicator.measureUnit.__string) {
                        _indicator._measureUnitString = _indicator.measureUnit.__string;
                      } else {
                        _indicator._measureUnitString = '';
                      }
                      value.project[p].problemReg[b].indicatorBasic[i]._resultInfoPrint =
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
          }
          let correctBudget = 1000.0;
          let valueFix = 3;

          if (_budgetTypeByProgram.byProject && _budgetTypeByProgram.byProject.length) {
            for (let i = 0; i < _budgetTypeByProgram.byProject.length; i++) {
              _budgetTypeByProgram.byProject[i] = correctSumByIndicatorBudget(_budgetTypeByProgram.byProject[i], correctBudget, valueFix);
            }
          }
          _budgetTypeByProgram = correctSumByIndicatorBudget(_budgetTypeByProgram, correctBudget, valueFix);

          value._budgetTypeByProgram = _budgetTypeByProgram;
        }
      }
    }
    return value;
  };
}

module.exports = programPassportInjector;
