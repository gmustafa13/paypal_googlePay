var braintree = require("braintree");
// const moment = require('moment');
// brain-tree credential 
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: 'your merchantId',
  publicKey: 'you public key',
  privateKey: 'your private key'
});

// generate token abd send to client
let generateToken = async (req,res) => {
 return  await gateway.clientToken.generate({}).then((result) => {
   return result;
 }).catch((e) => {
    return e
  })
}
module.exports.generateToken = generateToken

let checkOut = async (clientInfo,res) => {
let paymentRes = await gateway.transaction.sale({
    amount: clientInfo.userInfo.amount,
    paymentMethodNonce: clientInfo.mPaymentMethodNonce.mNonce,
    deviceData:clientInfo.mDeviceData,
  options: {
    submitForSettlement: true
  },
}).then(async function (result) {
  if (result.success) {
    let queryObj = {};
    queryObj.transaction_id  = result.transaction.id;
    queryObj.plans_id        = clientInfo.userInfo.planId;
    queryObj.artist_id       = clientInfo.userInfo.artistId;
    queryObj.user_id         = clientInfo.userInfo.uid;
    // queryObj.startDate       = moment().utc().format();
    queryObj.amount          = clientInfo.userInfo.amount;
    queryObj.plan_type       = clientInfo.userInfo.plan.toLowerCase() == 'monthly' ? 0 : 1  // 0: for month 1: year 
    // queryObj.endDate         = queryObj.plan_type==0?moment(queryObj.startDate).add(1, 'months').utc().format():moment(queryObj.startDate).add(12, 'months').utc().format();
    await Models.Transaction.create(queryObj);
    if(clientInfo.userInfo.pre_plans_id){
    let obj= { subscribe_status:0 }
    await Models.Transaction.update(obj,{where:{plans_id: clientInfo.userInfo.pre_plans_id, artist_id: clientInfo.userInfo.artistId,user_id:clientInfo.userInfo.uid}});
    }
    return result.transaction.id
  } else {
    ReE(res, result, 400);
  }
  }).catch(function (err) {
    ReE(res, err, 400);
  });
 return paymentRes
}
module.exports.checkOut = checkOut;