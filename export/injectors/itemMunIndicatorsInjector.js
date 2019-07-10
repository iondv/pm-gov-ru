
const moment = require('moment');

function itemMunIndicatorsInjector() {
  /**
   *
   * @param {{}} value
   */
  this.inject = function (value) {
    if (value) {
      if (value.__class && value.__class === 'project@pm-gov-ru') {

        let _programColl = [];
        let _aipColl = [];
        let _indicatorBasicColl = [];
        let _valueBasicColl = [];
        value._indicatorBasicByProject = [];
        let tzone = "UTC";
        _programColl = value.program;
        if  (_programColl && _programColl.length) {
          for (let p = 0; p < _programColl.length; p++) {
            _aipColl = _programColl[p].aip;
            if  (_aipColl && _aipColl.length) {
              for (let a = 0; a < _aipColl.length; a++) {
                let _aipMo = 'Не выбрано';
                if (_aipColl[a].mo && _aipColl[a].mo.name) {
                  _aipMo = _aipColl[a].mo.name;
                }
                _indicatorBasicColl = _aipColl[a].indicatorBasic;
                if  (_indicatorBasicColl && _indicatorBasicColl.length) {
                  for (let i = 0; i < _indicatorBasicColl.length; i++) {

                    let _name = _indicatorBasicColl[i].name;
                    let _baseValuePrint = '';
                    let _baseDatePrint = '';
                    if (_indicatorBasicColl[i].baseValuePrint > 0) {
                      _baseValuePrint = _indicatorBasicColl[i].baseValuePrint;
                      _baseDatePrint = moment(_indicatorBasicColl[i].baseDatePrint).tz(tzone).format('DD.MM.YYYY');
                    }
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

                    let initByProject = {
                      name: _name,
                      baseValuePrint: '',
                      baseDatePrint: '',
                      sumPeriodY1: 0,
                      sumPeriodY2: 0,
                      sumPeriodY3: 0,
                      sumPeriodY4: 0,
                      sumPeriodY5: 0,
                      sumPeriodY6: 0,
                      sumPeriodY7: 0,
                      moAip: []
                    };
                    let _ipColl = value._indicatorBasicByProject;
                    if (_ipColl.length === 0) {
                      _ipColl.push(initByProject);
                    } else {
                      let count = 0;
                      for (let ip = 0; ip < _ipColl.length; ip++) {
                        if (_ipColl[ip].name && _ipColl[ip].name === _name) {
                          count++;
                        }
                      }
                      if (count === 0) {
                        _ipColl.push(initByProject);
                      }
                    }

                    for (let ip = 0; ip < _ipColl.length; ip++) {
                      if (_ipColl[ip].name && _ipColl[ip].name === _name) {
                        if (_baseValuePrint) {
                          _ipColl[ip].baseValuePrint += _baseValuePrint + "\n";
                          _ipColl[ip].baseDatePrint += _baseDatePrint + "\n";
                        }
                        _ipColl[ip].sumPeriodY1 += _sumPeriodY1;
                        _ipColl[ip].sumPeriodY2 += _sumPeriodY2;
                        _ipColl[ip].sumPeriodY3 += _sumPeriodY3;
                        _ipColl[ip].sumPeriodY4 += _sumPeriodY4;
                        _ipColl[ip].sumPeriodY5 += _sumPeriodY5;
                        _ipColl[ip].sumPeriodY6 += _sumPeriodY6;
                        _ipColl[ip].sumPeriodY7 += _sumPeriodY7;

                        let initByMO = {
                          name: _aipMo,
                          baseValuePrint: '',
                          baseDatePrint: '',
                          sumPeriodY1: 0,
                          sumPeriodY2: 0,
                          sumPeriodY3: 0,
                          sumPeriodY4: 0,
                          sumPeriodY5: 0,
                          sumPeriodY6: 0,
                          sumPeriodY7: 0
                        };
                        let _moAip = _ipColl[ip].moAip;
                        if (_moAip.length === 0) {
                          _moAip.push(initByMO);
                        } else {
                          let count = 0;
                          for (let m = 0; m < _moAip.length; m++) {
                            if (_moAip[m].name && _moAip[m].name === _aipMo) {
                              count++;
                            }
                          }
                          if (count === 0) {
                            _moAip.push(initByMO);
                          }
                        }

                        for (let m = 0; m < _moAip.length; m++) {
                          if (_moAip[m].name && _moAip[m].name === _aipMo) {
                            if (_baseValuePrint) {
                              _moAip[m].baseValuePrint += _baseValuePrint + "\n";
                              _moAip[m].baseDatePrint += _baseDatePrint + "\n";
                            }
                            _moAip[m].sumPeriodY1 += _sumPeriodY1;
                            _moAip[m].sumPeriodY2 += _sumPeriodY2;
                            _moAip[m].sumPeriodY3 += _sumPeriodY3;
                            _moAip[m].sumPeriodY4 += _sumPeriodY4;
                            _moAip[m].sumPeriodY5 += _sumPeriodY5;
                            _moAip[m].sumPeriodY6 += _sumPeriodY6;
                            _moAip[m].sumPeriodY7 += _sumPeriodY7;
                          }
                        }
                      }
                    }
                    value._indicatorBasicByProject = _ipColl;
                  }
                }
              }
            }
          }
        }
      }
    }
    return value;
  };
}

module.exports = itemMunIndicatorsInjector;
