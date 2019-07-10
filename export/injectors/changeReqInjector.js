
const moment = require('moment');

function changeReqInjector() {
  /**
   *
   * @param {{}} value
   */
  this.inject = function (value) {
    if (value) {
      if (value.__class && value.__class === 'changeReq@pm-gov-ru') {

        function getSumByIndicatorBasic(indicatorValueBasic, sumPeriod, addStep, formatEq) {
          let _datePlannedStart = moment();
          if (value.basicObj && value.basicObj.datePlannedStart) {
            _datePlannedStart = value.basicObj.datePlannedStart;
          }
          if  (indicatorValueBasic && indicatorValueBasic.length) {
            for (let indexInd = 0; indexInd < indicatorValueBasic.length; indexInd++) {
              if (indicatorValueBasic[indexInd].dateStart && _datePlannedStart) {
                for (let s = 0; s < sumPeriod.length; s++)
                {
                  let _dateStartPeriod = moment(_datePlannedStart).tz(tzone).add(s, addStep).format(formatEq);
                  let dateStartValueBasic = moment(indicatorValueBasic[indexInd].dateStart).tz(tzone).format(formatEq);
                  if (dateStartValueBasic === _dateStartPeriod) {
                    if (typeof indicatorValueBasic[indexInd].plannedValue === 'number') {
                      sumPeriod[s] += indicatorValueBasic[indexInd].plannedValue;
                    }
                    if (typeof indicatorValueBasic[indexInd].plannedValue === 'string') {
                      sumPeriod[s] += indicatorValueBasic[indexInd].plannedValue + '\n';
                    }
                  }
                }
              }
            }
          }
          return sumPeriod; 
        }

        let tzone = "Asia/Vladivostok";

        let _changeIndicatorsColl = value.changeIndicatorsCol;
        if  (_changeIndicatorsColl && _changeIndicatorsColl.length) {
          for (let i = 0; i < _changeIndicatorsColl.length; i++) {
            if (_changeIndicatorsColl[i] && 
              _changeIndicatorsColl[i].currentEdition && 
              _changeIndicatorsColl[i].currentEdition.__class && 
              (_changeIndicatorsColl[i].currentEdition.__class === 'indicatorFinancial@pm-gov-ru' ||
              _changeIndicatorsColl[i].currentEdition.__class === 'indicatorDigital@pm-gov-ru')) {

              let _sumPeriodY = [0,0,0,0,0];
              _sumPeriodY = getSumByIndicatorBasic(_changeIndicatorsColl[i].currentEdition.indicatorValueBasic, _sumPeriodY, 'years', 'YYYY');
              
              _changeIndicatorsColl[i].currentEdition.sumPeriodY1 = _sumPeriodY[0];
              _changeIndicatorsColl[i].currentEdition.sumPeriodY2 = _sumPeriodY[1];
              _changeIndicatorsColl[i].currentEdition.sumPeriodY3 = _sumPeriodY[2];
              _changeIndicatorsColl[i].currentEdition.sumPeriodY4 = _sumPeriodY[3];
              _changeIndicatorsColl[i].currentEdition.sumPeriodY5 = _sumPeriodY[4];
            }
            if (_changeIndicatorsColl[i] && 
              _changeIndicatorsColl[i].newEdition && 
              _changeIndicatorsColl[i].newEdition.__class && 
              (_changeIndicatorsColl[i].newEdition.__class === 'indicatorFinancial@pm-gov-ru' ||
              _changeIndicatorsColl[i].newEdition.__class === 'indicatorDigital@pm-gov-ru')) {

              let _sumPeriodY = [0,0,0,0,0];
              _sumPeriodY = getSumByIndicatorBasic(_changeIndicatorsColl[i].newEdition.indicatorValueBasic, _sumPeriodY, 'years', 'YYYY');
              
              _changeIndicatorsColl[i].newEdition.sumPeriodY1 = _sumPeriodY[0];
              _changeIndicatorsColl[i].newEdition.sumPeriodY2 = _sumPeriodY[1];
              _changeIndicatorsColl[i].newEdition.sumPeriodY3 = _sumPeriodY[2];
              _changeIndicatorsColl[i].newEdition.sumPeriodY4 = _sumPeriodY[3];
              _changeIndicatorsColl[i].newEdition.sumPeriodY5 = _sumPeriodY[4];
            }
            value.changeIndicatorsCol[i] = _changeIndicatorsColl[i];
          }
        }

        _changeIndicatorsColl = value.changeBudgetCol;
        if  (_changeIndicatorsColl && _changeIndicatorsColl.length) {
          for (let i = 0; i < _changeIndicatorsColl.length; i++) {
            let _rmap = 0;
            if (_changeIndicatorsColl[i] && 
              _changeIndicatorsColl[i].currentEdition && 
              _changeIndicatorsColl[i].currentEdition.__class && 
              _changeIndicatorsColl[i].currentEdition.__class === 'indicatorBudget@pm-gov-ru') {

              let _sumPeriodY = [0,0,0,0];
              _sumPeriodY = getSumByIndicatorBasic(_changeIndicatorsColl[i].currentEdition.indicatorValueBasic, _sumPeriodY, 'years', 'YYYY');
              
              _changeIndicatorsColl[i].currentEdition.sumPeriodY1 = _sumPeriodY[0];
              _changeIndicatorsColl[i].currentEdition.sumPeriodY2 = _sumPeriodY[1];
              _changeIndicatorsColl[i].currentEdition.sumPeriodY3 = _sumPeriodY[2];
              _changeIndicatorsColl[i].currentEdition.sumPeriodY4 = _sumPeriodY[3];
              _changeIndicatorsColl[i].currentEdition.sumPeriodAll = 
              _sumPeriodY[0] + _sumPeriodY[1] + _sumPeriodY[2] + _sumPeriodY[3];

              let _sumPeriodType = [0,0,0,0];
              if (_changeIndicatorsColl[i].currentEdition.budgetType === 'federal') {
                _sumPeriodType[0] = _changeIndicatorsColl[i].currentEdition.sumPeriodAll;
              }
              if (_changeIndicatorsColl[i].currentEdition.budgetType === 'krai') {
                _sumPeriodType[1] = _changeIndicatorsColl[i].currentEdition.sumPeriodAll;
              }
              if (_changeIndicatorsColl[i].currentEdition.budgetType === 'munic') {
                _sumPeriodType[2] = _changeIndicatorsColl[i].currentEdition.sumPeriodAll;
              }
              if (_changeIndicatorsColl[i].currentEdition.budgetType === 'vnebudget') {
                _sumPeriodType[3] = _changeIndicatorsColl[i].currentEdition.sumPeriodAll;
              }
              _changeIndicatorsColl[i].currentEdition._sumPeriodType = _sumPeriodType;
              _changeIndicatorsColl[i].currentEdition._sumSourceAll = _sumPeriodType[0] + _sumPeriodType[1] + _sumPeriodType[2] + _sumPeriodType[3];
              if (_changeIndicatorsColl[i].currentEdition.obj) {
                _changeIndicatorsColl[i].currentEdition._objDateStart = moment(_changeIndicatorsColl[i].currentEdition.obj.datePlannedStart).tz(tzone).format('YYYY');
                _changeIndicatorsColl[i].currentEdition._objDateEnd = moment(_changeIndicatorsColl[i].currentEdition.obj.datePlannedEnd).tz(tzone).format('YYYY');
                _rmap++;
              }
            }
            if (_changeIndicatorsColl[i] && 
              _changeIndicatorsColl[i].newEdition && 
              _changeIndicatorsColl[i].newEdition.__class && 
              _changeIndicatorsColl[i].newEdition.__class === 'indicatorBudget@pm-gov-ru') {

              let _sumPeriodY = [0,0,0,0];
              _sumPeriodY = getSumByIndicatorBasic(_changeIndicatorsColl[i].newEdition.indicatorValueBasic, _sumPeriodY, 'years', 'YYYY');
              
              _changeIndicatorsColl[i].newEdition.sumPeriodY1 = _sumPeriodY[0];
              _changeIndicatorsColl[i].newEdition.sumPeriodY2 = _sumPeriodY[1];
              _changeIndicatorsColl[i].newEdition.sumPeriodY3 = _sumPeriodY[2];
              _changeIndicatorsColl[i].newEdition.sumPeriodY4 = _sumPeriodY[3];
              _changeIndicatorsColl[i].newEdition.sumPeriodAll = 
              _sumPeriodY[0] + _sumPeriodY[1] + _sumPeriodY[2] + _sumPeriodY[3];

              let _sumPeriodType = [0,0,0,0];
              if (_changeIndicatorsColl[i].newEdition.budgetType === 'federal') {
                _sumPeriodType[0] = _changeIndicatorsColl[i].newEdition.sumPeriodAll;
              }
              if (_changeIndicatorsColl[i].newEdition.budgetType === 'krai') {
                _sumPeriodType[1] = _changeIndicatorsColl[i].newEdition.sumPeriodAll;
              }
              if (_changeIndicatorsColl[i].newEdition.budgetType === 'munic') {
                _sumPeriodType[2] = _changeIndicatorsColl[i].newEdition.sumPeriodAll;
              }
              if (_changeIndicatorsColl[i].newEdition.budgetType === 'vnebudget') {
                _sumPeriodType[3] = _changeIndicatorsColl[i].newEdition.sumPeriodAll;
              }
              _changeIndicatorsColl[i].newEdition._sumPeriodType = _sumPeriodType;
              _changeIndicatorsColl[i].newEdition._sumSourceAll = _sumPeriodType[0] + _sumPeriodType[1] + _sumPeriodType[2] + _sumPeriodType[3];
              if (_changeIndicatorsColl[i].newEdition.obj) {
                _changeIndicatorsColl[i].newEdition._objDateStart = moment(_changeIndicatorsColl[i].newEdition.obj.datePlannedStart).tz(tzone).format('YYYY');
                _changeIndicatorsColl[i].newEdition._objDateEnd = moment(_changeIndicatorsColl[i].newEdition.obj.datePlannedEnd).tz(tzone).format('YYYY');
                _rmap++;
              }
            }
            if (_rmap === 2) {
              _changeIndicatorsColl[i].isPlan = true;
            }
          }
          value.changeBudgetCol = _changeIndicatorsColl;
        }
      }
    }
    return value;
  };
}

module.exports = changeReqInjector;
