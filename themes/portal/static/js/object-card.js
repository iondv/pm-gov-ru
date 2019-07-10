'use strict';

(function () {

  window.createObjectCard = function (d, $card) {
    var $title = get('title').html(d.name);
    var $pictures = $card.find('.obj-card-pictures');

    if (d.objectBasic.imageObj) {
      createImage(d.objectBasic.imageObj, 'image1');
      createImage(d.objectBasic.imageObj, 'image2');
      $card.find('.obj-card-title').parent().removeClass('col-md-12').addClass('col-md-9');
      $pictures.show();
    } else {
      $pictures.hide();
    }
    get('head').html(d.head ? d.head.__string : '<span class="not-set">нет данных</span>');
    var photo = d.head && d.head.person_ref && d.head.person_ref.foto;
    get('avatar').css('background-image', 'url('+ (photo ? photo.link : 'portal/pm/images/nophoto.png') +')');
    get('descript').html(d.descript);
    get('dateStart').html(d.datePlannedStart ? moment(d.datePlannedStart).format('DD.MM.YY') : '');
    get('dateEnd').html(d.datePlannedEnd ? moment(d.datePlannedEnd).format('DD.MM.YY') : '');
    get('changeOrder').html(d.changeOrder);
    get('changeProgInd').html(d.changeProgInd);
    get('costOrder').html(d.costOrder);
    get('keyTask').html(d.keyTask);

    prepareObjectCard($card, d);
    CommonHelper.alignByHeight(get('obj-card-cost-table'), get('obj-card-fin-table'));

    function get (id) {
      return $card.find('[data-id="'+ id +'"]');
    }

    function createImage (data, id) {
      var link = data.thumbnails && data.thumbnails.medium && data.thumbnails.medium.link || data.link;
      get(id).attr('src', link);
    }

  };

  function prepareObjectCard ($card, data) {
    var res = {};
    var cardSMR = searchObject('СМР', data._reportCardObject, 'measureType');
    var cardFacility = searchObject('Обор.', data._reportCardObject, 'measureType');
    var cardOther = searchObject('Прочее', data._reportCardObject, 'measureType');

    res.plannedCMP = round(cardSMR && cardSMR.plan);
    res.plannedFacility = round(cardFacility && cardFacility.plan);
    res.plannedOther = round(cardOther && cardOther.plan);

    res.planTaskCMP = res.plannedCMP;
    res.planTaskFacility = res.plannedFacility;
    res.planTaskOther = res.plannedOther;

    res.targetTaskCMP = round(cardSMR && cardSMR.req);
    res.targetTaskFacility = round(cardFacility && cardFacility.req);
    res.targetTaskOther = round(cardOther && cardOther.req);

    var factTaskCMP = round(cardSMR && cardSMR.fact);
    var factTaskFacility = round(cardFacility && cardFacility.fact);
    var factTaskOther = round(cardOther && cardOther.fact);

    res.illegContrCMP = isNum(res.planTaskCMP, factTaskCMP) ? res.planTaskCMP - factTaskCMP : NaN;
    res.illegContrFacility = isNum(res.planTaskFacility, factTaskFacility) ? res.planTaskFacility - factTaskFacility : NaN;
    res.illegContrOther = isNum(res.planTaskOther, factTaskOther) ? res.planTaskOther - factTaskOther : NaN;

    var workSMR = searchObject('СМР', data._reportCardWork, 'measureType');
    var workFacility = searchObject('Обор.', data._reportCardWork, 'measureType');
    var workOther = searchObject('Прочее', data._reportCardWork, 'measureType');

    res.estimCostCMP = round(workSMR && workSMR.plan);
    res.estimCostFacility = round(workFacility && workFacility.plan);
    res.estimCostOther = round(workOther && workOther.plan);

    res.estimCost = round(data._reportCardWorkTotal && data._reportCardWorkTotal.plan);

    res.costContractSMR = round(workSMR && workSMR.plan);
    res.costContractFacility = round(workFacility && workFacility.plan);
    res.costContractOther = round(workOther && workOther.plan);

    res.costOldContractSMR = round(workSMR && workSMR.fact);
    res.costOldContractFacility = round(workFacility && workFacility.fact);
    res.costOldContractOther = round(workOther && workOther.fact);

    var reqSMR = round(workSMR && workSMR.req);
    var reqFacility = round(workFacility && workFacility.req);
    var reqOther = round(workOther && workOther.req);

    var factSMR = round(workSMR && workSMR.fact);
    var factFacility = round(workFacility && workFacility.fact);
    var factOther = round(workOther && workOther.fact);

    var costContractSum = sum(res.costContractSMR, res.costContractFacility, res.costContractOther);
    var reqSum = sum(reqSMR, reqFacility, reqOther);
    var factSum = sum(factSMR, factFacility, factOther);

    res.planPercent = percent(costContractSum, reqSum);
    res.factPercent = percent(factSum, costContractSum);
    res.needWorkSuccess = round(costContractSum - factSum);//reqSum

    if (isNum(res.planPercent, res.factPercent)) {
      get('factPercentCell').addClass(res.planPercent > res.factPercent ? 'bg-danger' : 'bg-success');
    }

    var cardFb = searchObject('Федеральный', data._reportCardObject, 'budgetType');
    var cardRegion = searchObject('Краевой', data._reportCardObject, 'budgetType');
    var cardMun = searchObject('Муниципальный', data._reportCardObject, 'budgetType');
    var cardExtra = searchObject('Внебюджетный', data._reportCardObject, 'budgetType');

    res.dpFb = round(cardFb && cardFb.req);
    res.dpRegion = round(cardRegion && cardRegion.req);
    res.dpMun = round(cardMun && cardMun.req);
    res.dpExtra = round(cardExtra && cardExtra.req);

    res.kaipFb = round(cardFb && cardFb.plan);
    res.kaipRegion = round(cardRegion && cardRegion.plan);
    res.kaipMun = round(cardMun && cardMun.plan);
    res.kaipExtra = round(cardExtra && cardExtra.plan);

    res.factFb = round(cardFb && cardFb.fact);
    res.factRegion = round(cardRegion && cardRegion.fact);
    res.factMun = round(cardMun && cardMun.fact);
    res.factExtra = round(cardExtra && cardExtra.fact);

    res.dpKb = sum(res.dpRegion, res.dpMun);
    res.kaipKb = sum(res.kaipRegion, res.kaipMun);
    res.factKb = sum(res.factRegion, res.factMun);

    var reportCardFinTotal = data._reportCardFinTotal || {};
    var reqFinTotal = round(reportCardFinTotal.req);
    var planFinTotal = round(reportCardFinTotal.plan);
    var factFinTotal = round(reportCardFinTotal.fact);
    var rateFinTotal = round(reportCardFinTotal.rate);

    res.finanYear = reqFinTotal;
    res.finFb = (res.factFb - res.kaipFb);
    res.finRegion = (res.factRegion - res.kaipRegion);
    res.finMun = (res.factMun - res.kaipMun);
    res.finExtra = (res.factExtra - res.kaipExtra);
    res.finKb = sum(res.finRegion, res.finMun);

    // isNum(reqFinTotal, planFinTotal) && planFinTotal < reqFinTotal
    if ((isNum(res.finFb) && res.finFb < 0)
      || (isNum(res.finRegion) && res.finRegion < 0)
      || (isNum(res.finMun) && res.finMun < 0)
      || (isNum(res.finExtra) && res.finExtra < 0)) {
      get('fin').html('Дефицит').addClass('bg-danger');
    }
    fillBack('finFb');
    fillBack('finRegion');
    fillBack('finMun');
    fillBack('finExtra');
    fillBack('finKb');

    build();

    function get (id) {
      var $result = $card.find('[data-id="'+ id +'"]');
      for (var i = 1; i < arguments.length; ++i) {
        $result = $result.add($card.find('[data-id="'+ arguments[i] +'"]'));
      }
      return $result;
    }

    function build () {
      for (var key in res) {
        if (res.hasOwnProperty(key)) {
          get(key).html(isNaN(res[key]) ? '-' : res[key]);
        }
      }
    }

    function isNum () {
      for (var i = 0; i < arguments.length; ++i) {
        if (isNaN(arguments[i])) {
          return false;
        }
      }
      return true;
    }

    function sum () {
      var result;
      for (var i = 0; i < arguments.length; ++i) {
        if (!isNaN(arguments[i]) && arguments[i] !== undefined) {
          result = result === undefined ? arguments[i] : (result + arguments[i]);
        }
      }
      return result === undefined ? NaN : round(result);
    }

    function percent (a, b) {
      return (isNaN(a) || isNaN(b) || b === 0) ? NaN : round(a * 100 / b, 10);
    }

    function round (value, base) {
      base = base || 100;
      return Math.round(parseFloat(value) * base) / base;
    }

    function fillBack (id) {
      if (!isNaN(res[id])) {
        if (res[id] < 0) {
          get(id).addClass('bg-danger');
          res[id] = -res[id];
        } else {
          get(id).addClass('bg-success');
        }
      }
    }

    function searchObject (value, objects, key) {
      if (objects instanceof Array) {
        for (let i = 0; i < objects.length; ++i) {
          if (objects[i] && objects[i][key] === value) {
            return objects[i];
          }
        }
      }
    }
  };
})();
