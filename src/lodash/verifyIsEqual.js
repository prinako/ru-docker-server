const isEqual = require("lodash/isEqual");
const { findCardapioByDate, todosOsCardpio } = require("../databases/querys");

async function isItNeedToNotify({cardapioDeHoje, toDayDate}, next) {
  if (cardapioDeHoje!= null) {
    const b = await findCardapioByDate(toDayDate, (e) => e);
    const almoco = isEqual(cardapioDeHoje.amoco, b.amoco);
    const jantar = isEqual(cardapioDeHoje.jantar, b.jantar);
    const nomeDaRefei = isEqual(cardapioDeHoje.nomeDaRefei, b.nomeDaRefei);
    // console.log(almoco);
    return next({ almoco, jantar, nomeDaRefei });
  }
}

async function isNewCardapio(newCardapioFromRuSite, next){
  const getCardapioFromDatabase = await todosOsCardpio(d => d);
  const isNewCardapioToUpdate = isEqual(getCardapioFromDatabase, newCardapioFromRuSite);
  return next(isNewCardapioToUpdate);
}

module.exports = { isItNeedToNotify, isNewCardapio };
