
const moment = require('moment');

function itemProgressInjector() {
  /**
   *
   * @param {{}} value
   */
  this.inject = function (value) {
    if (value) {
      if (value.__class && 
        (value.__class === 'project@pm-gov-ru' || value.__class === 'program@pm-gov-ru')) {
        let _indicatorBasicColl = [];
        let _valueBasicColl = [];
        let tzone = "UTC";
        let _periodYear = value.periodYYYY;
        value._periodYear = (_periodYear > 0) ? _periodYear : value.now.getFullYear();
        if(value.__class === 'project@pm-gov-ru') {
          _indicatorBasicColl = value.indicatorBasic;
        }
        if(value.__class === 'program@pm-gov-ru') {
          _indicatorBasicColl = value.indicator;
        }
        if  (_indicatorBasicColl && _indicatorBasicColl.length) {
          for (let i = 0; i < _indicatorBasicColl.length; i++) {

            let _sumFactQ1 = 0;
            let _sumFactQ2 = 0;
            let _sumFactQ3 = 0;
            let _sumFactQ4 = 0;
            let _sumProgQ1 = 0;
            let _sumProgQ2 = 0;
            let _sumProgQ3 = 0;
            let _sumProgQ4 = 0;

            _valueBasicColl = _indicatorBasicColl[i].indicatorValueBasic;
            if  (_valueBasicColl && _valueBasicColl.length) {
              for (let j = 0; j < _valueBasicColl.length; j++) {

                if (_valueBasicColl[j].dateStart && value._periodYear === moment(_valueBasicColl[j].dateStart).tz(tzone).format('YYYY')) {
                  if (moment(_valueBasicColl[j].dateStart).tz(tzone).format('Q') === '1') {
                    _sumFactQ1 += _valueBasicColl[j].value;
                    _sumProgQ1 += _valueBasicColl[j].plannedValue;
                  }
                  if (moment(_valueBasicColl[j].dateStart).tz(tzone).format('Q') === '2') {
                    _sumFactQ2 += _valueBasicColl[j].value;
                    _sumProgQ2 += _valueBasicColl[j].plannedValue;
                  }
                  if (moment(_valueBasicColl[j].dateStart).tz(tzone).format('Q') === '3') {
                    _sumFactQ3 += _valueBasicColl[j].value;
                    _sumProgQ3 += _valueBasicColl[j].plannedValue;
                  }
                  if (moment(_valueBasicColl[j].dateStart).tz(tzone).format('Q') === '4') {
                    _sumFactQ4 += _valueBasicColl[j].value;
                    _sumProgQ4 += _valueBasicColl[j].plannedValue;
                  }
                }

              }
            }
            if(value.__class === 'project@pm-gov-ru') {
              value.indicatorBasic[i]._sumFactQ1 = _sumFactQ1;
              value.indicatorBasic[i]._sumFactQ2 = _sumFactQ2;
              value.indicatorBasic[i]._sumFactQ3 = _sumFactQ3;
              value.indicatorBasic[i]._sumFactQ4 = _sumFactQ4;

              value.indicatorBasic[i]._sumProgQ1 = _sumProgQ1;
              value.indicatorBasic[i]._sumProgQ2 = _sumProgQ2;
              value.indicatorBasic[i]._sumProgQ3 = _sumProgQ3;
              value.indicatorBasic[i]._sumProgQ4 = _sumProgQ4;
              value.indicatorBasic[i]._sumProgY = _sumProgQ1 + _sumProgQ2 + _sumProgQ3 + _sumProgQ4;
            }
            if(value.__class === 'program@pm-gov-ru') {
              value.indicator[i]._sumFactQ1 = _sumFactQ1;
              value.indicator[i]._sumFactQ2 = _sumFactQ2;
              value.indicator[i]._sumFactQ3 = _sumFactQ3;
              value.indicator[i]._sumFactQ4 = _sumFactQ4;

              value.indicator[i]._sumProgQ1 = _sumProgQ1;
              value.indicator[i]._sumProgQ2 = _sumProgQ2;
              value.indicator[i]._sumProgQ3 = _sumProgQ3;
              value.indicator[i]._sumProgQ4 = _sumProgQ4;
              value.indicator[i]._sumProgY = _sumProgQ1 + _sumProgQ2 + _sumProgQ3 + _sumProgQ4;
            }
          }
        }
        let _sumBudgetPlanQ1 = 0;
        let _sumBudgetPlanQ2 = 0;
        let _sumBudgetPlanQ3 = 0;
        let _sumBudgetPlanQ4 = 0;
        let _sumAllBudgetPlan = 0;
        let _sumBudgetFactQ1 = 0;
        let _sumBudgetFactQ2 = 0;
        let _sumBudgetFactQ3 = 0;
        let _sumBudgetFactQ4 = 0;
        let _sumAllBudgetFact = 0;
        let _sumBudgetProgQ1 = 0;
        let _sumBudgetProgQ2 = 0;
        let _sumBudgetProgQ3 = 0;
        let _sumBudgetProgQ4 = 0;
        let _sumAllBudgetProg = 0;
        // отклонение
        let _deviationQ1 = 0;
        let _deviationQ2 = 0;
        let _deviationQ3 = 0;
        let _deviationQ4 = 0;
        let _deviationAll = 0;

        //value.project.indicatorBudgetproject
        if(value.__class === 'project@pm-gov-ru') {

          _indicatorBasicColl = value.indicatorBudget;
          if  (_indicatorBasicColl && _indicatorBasicColl.length) {
            for (let i = 0; i < _indicatorBasicColl.length; i++) {
              
              _valueBasicColl = _indicatorBasicColl[i].indicatorValueBasic;
              if  (_valueBasicColl && _valueBasicColl.length) {
                for (let j = 0; j < _valueBasicColl.length; j++) {
  
                  _sumAllBudgetPlan += _valueBasicColl[j].plannedValue;
                  _sumAllBudgetFact += _valueBasicColl[j].value;
                  _sumAllBudgetProg += _valueBasicColl[j].desiredValue;
                  _deviationAll += _valueBasicColl[j].deviation;
  
                  if (_valueBasicColl[j].dateStart && value._periodYear === moment(_valueBasicColl[j].dateStart).tz(tzone).format('YYYY')) {
                    if (moment(_valueBasicColl[j].dateStart).tz(tzone).format('Q') === '1') {
                      _sumBudgetPlanQ1 += _valueBasicColl[j].plannedValue;
                      _sumBudgetFactQ1 += _valueBasicColl[j].value;
                      _sumBudgetProgQ1 += _valueBasicColl[j].desiredValue;
                      _deviationQ1 += _valueBasicColl[j].deviation;
                    }
                    if (moment(_valueBasicColl[j].dateStart).tz(tzone).format('Q') === '2') {
                      _sumBudgetPlanQ2 += _valueBasicColl[j].plannedValue;
                      _sumBudgetFactQ2 += _valueBasicColl[j].value;
                      _sumBudgetProgQ2 += _valueBasicColl[j].desiredValue;
                      _deviationQ2 += _valueBasicColl[j].deviation;
                    }
                    if (moment(_valueBasicColl[j].dateStart).tz(tzone).format('Q') === '3') {
                      _sumBudgetPlanQ3 += _valueBasicColl[j].plannedValue;
                      _sumBudgetFactQ3 += _valueBasicColl[j].value;
                      _sumBudgetProgQ3 += _valueBasicColl[j].desiredValue;
                      _deviationQ3 += _valueBasicColl[j].deviation;
                    }
                    if (moment(_valueBasicColl[j].dateStart).tz(tzone).format('Q') === '4') {
                      _sumBudgetPlanQ4 += _valueBasicColl[j].plannedValue;
                      _sumBudgetFactQ4 += _valueBasicColl[j].value;
                      _sumBudgetProgQ4 += _valueBasicColl[j].desiredValue;
                      _deviationQ4 += _valueBasicColl[j].deviation;
                    }
                  }
  
                }
              }
            }
          }
        }
        if(value.__class === 'program@pm-gov-ru' && value.project) {
          for (let p = 0; p < value.project.length; p++) {

            _indicatorBasicColl = value.project[p].indicatorBudget;
            if  (_indicatorBasicColl && _indicatorBasicColl.length) {
              for (let i = 0; i < _indicatorBasicColl.length; i++) {
                
                _valueBasicColl = _indicatorBasicColl[i].indicatorValueBasic;
                if  (_valueBasicColl && _valueBasicColl.length) {
                  for (let j = 0; j < _valueBasicColl.length; j++) {
  
                    _sumAllBudgetPlan += _valueBasicColl[j].plannedValue;
                    _sumAllBudgetFact += _valueBasicColl[j].value;
                    _sumAllBudgetProg += _valueBasicColl[j].desiredValue;
                    _deviationAll += _valueBasicColl[j].deviation;
    
                    if (_valueBasicColl[j].dateStart && value._periodYear === moment(_valueBasicColl[j].dateStart).tz(tzone).format('YYYY')) {
                      if (moment(_valueBasicColl[j].dateStart).tz(tzone).format('Q') === '1') {
                        _sumBudgetPlanQ1 += _valueBasicColl[j].plannedValue;
                        _sumBudgetFactQ1 += _valueBasicColl[j].value;
                        _sumBudgetProgQ1 += _valueBasicColl[j].desiredValue;
                        _deviationQ1 += _valueBasicColl[j].deviation;
                      }
                      if (moment(_valueBasicColl[j].dateStart).tz(tzone).format('Q') === '2') {
                        _sumBudgetPlanQ2 += _valueBasicColl[j].plannedValue;
                        _sumBudgetFactQ2 += _valueBasicColl[j].value;
                        _sumBudgetProgQ2 += _valueBasicColl[j].desiredValue;
                        _deviationQ2 += _valueBasicColl[j].deviation;
                      }
                      if (moment(_valueBasicColl[j].dateStart).tz(tzone).format('Q') === '3') {
                        _sumBudgetPlanQ3 += _valueBasicColl[j].plannedValue;
                        _sumBudgetFactQ3 += _valueBasicColl[j].value;
                        _sumBudgetProgQ3 += _valueBasicColl[j].desiredValue;
                        _deviationQ3 += _valueBasicColl[j].deviation;
                      }
                      if (moment(_valueBasicColl[j].dateStart).tz(tzone).format('Q') === '4') {
                        _sumBudgetPlanQ4 += _valueBasicColl[j].plannedValue;
                        _sumBudgetFactQ4 += _valueBasicColl[j].value;
                        _sumBudgetProgQ4 += _valueBasicColl[j].desiredValue;
                        _deviationQ4 += _valueBasicColl[j].deviation;
                      }
                    }
    
                  }
                }
              }
            }
          }
        }
        let correctBudget = 1000.0;

        value._sumBudgetPlanQ1 = (_sumBudgetPlanQ1 / correctBudget).toFixed(3);
        value._sumBudgetPlanQ2 = (_sumBudgetPlanQ2 / correctBudget).toFixed(3);
        value._sumBudgetPlanQ3 = (_sumBudgetPlanQ3 / correctBudget).toFixed(3);
        value._sumBudgetPlanQ4 = (_sumBudgetPlanQ4 / correctBudget).toFixed(3);
        value._sumBudgetPlanY = ((_sumBudgetPlanQ1 + _sumBudgetPlanQ2 + _sumBudgetPlanQ3 + _sumBudgetPlanQ4) / correctBudget).toFixed(3);
        value._sumAllBudgetPlan = (_sumAllBudgetPlan / correctBudget).toFixed(3);

        value._sumBudgetFactQ1 = (_sumBudgetFactQ1 / correctBudget).toFixed(3);
        value._sumBudgetFactQ2 = (_sumBudgetFactQ2 / correctBudget).toFixed(3);
        value._sumBudgetFactQ3 = (_sumBudgetFactQ3 / correctBudget).toFixed(3);
        value._sumBudgetFactQ4 = (_sumBudgetFactQ4 / correctBudget).toFixed(3);
        value._sumBudgetFactY = ((_sumBudgetFactQ1 + _sumBudgetFactQ2 + _sumBudgetFactQ3 + _sumBudgetFactQ4) / correctBudget).toFixed(3);
        value._sumAllBudgetFact = (_sumAllBudgetFact / correctBudget).toFixed(3);

        value._sumBudgetProgQ1 = (_sumBudgetProgQ1 / correctBudget).toFixed(3);
        value._sumBudgetProgQ2 = (_sumBudgetProgQ2 / correctBudget).toFixed(3);
        value._sumBudgetProgQ3 = (_sumBudgetProgQ3 / correctBudget).toFixed(3);
        value._sumBudgetProgQ4 = (_sumBudgetProgQ4 / correctBudget).toFixed(3);
        value._sumBudgetProgY = ((_sumBudgetProgQ1 + _sumBudgetProgQ2 + _sumBudgetProgQ3 + _sumBudgetProgQ4) / correctBudget).toFixed(3);
        value._sumAllBudgetProg = (_sumAllBudgetProg / correctBudget).toFixed(3);

        value._deviationQ1 = (_deviationQ1 / correctBudget).toFixed(3);
        value._deviationQ2 = (_deviationQ2 / correctBudget).toFixed(3);
        value._deviationQ3 = (_deviationQ3 / correctBudget).toFixed(3);
        value._deviationQ4 = (_deviationQ4 / correctBudget).toFixed(3);
        value._deviationY = ((_deviationQ1 + _deviationQ2 + _deviationQ3 + _deviationQ4) / correctBudget).toFixed(3);
        value._deviationAll = (_deviationAll / correctBudget).toFixed(3);

        if (_deviationQ1 > 0) {
          value._deviationStateQ1 = "Перерасход";
        }
        if (_deviationQ1 < 0) {
          value._deviationStateQ1 = "Не освоен";
        }
        if (_deviationQ1 === 0) {
          value._deviationStateQ1 = "Достигнут";
        }
        if (_deviationQ2 > 0) {
          value._deviationStateQ2 = "Перерасход";
        }
        if (_deviationQ2 < 0) {
          value._deviationStateQ2 = "Не освоен";
        }
        if (_deviationQ2 === 0) {
          value._deviationStateQ2 = "Достигнут";
        }
        if (_deviationQ3 > 0) {
          value._deviationStateQ3 = "Перерасход";
        }
        if (_deviationQ3 < 0) {
          value._deviationStateQ3 = "Не освоен";
        }
        if (_deviationQ3 === 0) {
          value._deviationStateQ3 = "Достигнут";
        }
        if (_deviationQ4 > 0) {
          value._deviationStateQ4 = "Перерасход";
        }
        if (_deviationQ4 < 0) {
          value._deviationStateQ4 = "Не освоен";
        }
        if (_deviationQ4 === 0) {
          value._deviationStateQ4 = "Достигнут";
        }
        if (value._deviationY > 0) {
          value._deviationStateY = "Перерасход";
        }
        if (value._deviationY < 0) {
          value._deviationStateY = "Не освоен";
        }
        if (value._deviationY === 0) {
          value._deviationStateY = "Достигнут";
        }
        if (_deviationAll > 0) {
          value._deviationStateAll = "Перерасход";
        }
        if (_deviationAll < 0) {
          value._deviationStateAll = "Не освоен";
        }
        if (_deviationAll === 0) {
          value._deviationStateAll = "Достигнут";
        }

      }
    }
    return value;
  };
}

module.exports = itemProgressInjector;
