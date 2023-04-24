const { User, Cardapio, Reclama, Feedback, UsersTokens } = require("./schema");

async function formatCardapioFroDatabase(dados, next) {
  const novoCadapio = {
    dia: dados.dia[0],
    data: dados.dia[1],
    amoco: {
      refeicao: "ALMOÇO",
      nomeDaRefei: dados.almoco[0],
      ingredintes: {
        amo1: dados.almoco[3],
        amo2: dados.almoco[4],
        amo3: dados.almoco[5],
        amo4: dados.almoco[6],
        amo5: dados.almoco[7],
      },
      vegetariano1: dados.almoco[2],
    },
    jantar: {
      refeicao: "JANTAR",
      nomeDaRefei: dados.jantar[0],
      ingredintes: {
        jan1: dados.jantar[3],
        jan2: dados.jantar[4],
        jan3: dados.jantar[5],
        jan4: dados.jantar[6],
        jan5: dados.jantar[7],
      },
      vegetariano2: dados.jantar[2],
    },
  };
  return next(novoCadapio);
}

async function postCardapio(dados, next) {
  formatCardapioFroDatabase(dados, async (novoCadapio) => {
    const d = new Cardapio(novoCadapio);
    await d
      .save()
      .then(async (resolute) => {
        await connectMongoDBserver(d);
        next(resolute);
      })
      .catch((err) => next(err.keyValue));
  });
}

async function connectMongoDBserver(dados) {
  console.log(`we wii connect soon: ` + dados);
}

async function updateCardapio(dados) {
  formatCardapioFroDatabase(dados, async (novoCadapio) => {
    await Cardapio.findOneAndUpdate({ data: dados.dia[1] }, novoCadapio, {
      upsert: true,
    })
      .then()
      .catch((err, duc) => {
        if (err) {
          console.log(err);
          return false;
        }
        return true;
      });
    // .clone();
    return;
  });

  
  // const toUpdate = {
  //   dia: dados.dia[0],
  //   data: dados.dia[1],
  //   amoco: {
  //     refeicao: "ALMOÇO",
  //     nomeDaRefei: dados.almoco[0],
  //     ingredintes: {
  //       amo1: dados.almoco[3],
  //       amo2: dados.almoco[4],
  //       amo3: dados.almoco[5],
  //       amo4: dados.almoco[6],
  //       amo5: dados.almoco[7],
  //     },
  //     vegetariano1: dados.almoco[2],
  //   },
  //   jantar: {
  //     refeicao: "JANTAR",
  //     nomeDaRefei: dados.jantar[0],
  //     ingredintes: {
  //       jan1: dados.jantar[3],
  //       jan2: dados.jantar[4],
  //       jan3: dados.jantar[5],
  //       jan4: dados.jantar[6],
  //       jan5: dados.jantar[7],
  //     },
  //     vegetariano2: dados.jantar[2],
  //   },
  // };
  // console.log(toUpdate);
  //return next(duc);
}

async function todosOsCardapio(next) {
  const rs = await Cardapio.find().clone();
  return next(rs);
}

async function findCardapioByDate(data, next) {
  const cardapio = await Cardapio.findOne({ data: data });
  return next(cardapio);
}

async function getAllUsersTokens(next) {
  allTokens = [];
  const rs = await UsersTokens.find().clone();
  rs.forEach((tk) => allTokens.push(tk.token));
  // console.log(allTokens);
  return next(allTokens);
}

async function dropCollection(next) {
  // verify collection if new cardápio has ben added or not.
  const toBeVerified = await todosOsCardpio((e) => e);
  // const isToBeDrop = toBeVerified.length;
  // console.log(isToBeDrop);

  await Cardapio.collection
    .drop()
    .then((e) => next(true))
    .catch((err) => {
      console.error(err);
      return next(false);
    });

  // if (isToBeDrop > 5) {
  //   // notify all users
  //   //  await novoCardapioDaSemana();
  //   // drop collection
  // } else {
  // }
}

async function getCardapioFormatToVerify(dados, next) {
  await formatCardapioFroDatabase(dados, (cardapioFormatado) => {
    return next(cardapioFormatado);
  });
}

//   const rs = await Reclama.find((e, d) => d).clone();
//   return next(rs);
// }

// async function postUsersTokens(req, next) {
//   const token = req.body;
//   const isOkToInsect = await UsersTokens.findOne(token);

//   if (isOkToInsect == null) {
//     const isToken = new UsersTokens(token);
//     await isToken.save((err, duc) => {
//       if (err) {
//         return next(false);
//       } else {
//         // console.log(duc);
//         return next(true);
//       }
//     });
//   }
//   return next("exiting");
// }

// async function crioReclamaAqui(req, res) {
//   const { nome, email, curso, setor, msg } = req.body;
//   const newReclamaAqui = new Reclama({
//     nome: nome,
//     email: email,
//     curso: curso,
//     setor: setor,
//     msg: msg,
//   });

//   try {
//     await newReclamaAqui.save().then((e) => {
//       return res.status(200).json({ msy: "ok" });
//     });
//   } catch (err) {
//     return res.status(404).json({ msy: "ok" });
//   }
// }

// async function crioFeedback(req, res) {
//   const { nome, email, msg } = req.body;
//   const newFeedback = new Feedback({
//     nome: nome,
//     email: email,
//     msg: msg,
//   });

//   try {
//     await newFeedback.save().then((e) => {
//       return res.status(200).json({ msy: "ok" });
//     });
//   } catch (err) {
//     return res.status(404).json({ msy: "ok" });
//   }
// }

module.exports = {
  postCardapio,
  // todosOsReclameAqui,
  todosOsCardapio,
  findCardapioByDate,
  // crioReclamaAqui,
  // crioFeedback,
  updateCardapio,
  dropCollection,
  // postUsersTokens,
  getAllUsersTokens,
  formatCardapioFroDatabase,
  getCardapioFormatToVerify,
};
