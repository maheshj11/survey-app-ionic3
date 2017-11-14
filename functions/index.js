const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.createSurvey = functions.auth.user().onCreate(event => {

    console.log(event);
  const user = event.data;
  var survey = {
      title : "Sample Survey",
      disabled : false,
      surveyVotes : 0,
      type : "Single",
      optionsData :[{type: 'text', name: "A", totalVotes: 0, id: "ID" + Math.random(), checked: false},
      {type: 'text', name: "B", totalVotes: 0, id: "ID" + Math.random(), checked: false}]
  };
  console.log(survey);
//   this.surveyList = this.database.list(`/users/${user.uid}/surveys/`);
//   this.surveyList.push(survey)
  admin.database().ref(`/users/${user.uid}/surveys/`).push(survey);
});


exports.pushNotificationTrigger = functions.database.ref(`/users/{uid}/recieved-surveys/{key}`).onWrite((event) => {
    const recievedData = event.data.val();
    console.log(recievedData);

    admin.database().ref(`/user-tokens/`).once('value').then((allTokens) => {
        console.log(allTokens)
        let rawtokens = allTokens.val();
        let surveyOwnerToken;

        if (recievedData.didVote === true) {
            processtokens(rawtokens).then((processedtokens) => {
                for (var token of processedtokens) {
                    if (token.uid === recievedData.fromId) {
                        surveyOwnerToken = token.deviceToken;
                        var payload = {
                            "notification": {
                                "title": 'Recieved vote for you Survey',
                                "body": `${recievedData.votedUserName} voted for ${recievedData.title}`,
                                "sound": "default",
                                "click_action":"FCM_PLUGIN_ACTIVITY"
                            },
                            "data": {
                                "fromId": recievedData.fromId,
                                "fromKey": recievedData.fromKey
                            }
                        }
                        return admin.messaging().sendToDevice(surveyOwnerToken, payload).then((response) => {
                            console.log('Pushed notifications');
                        }).catch((err) => {
                            console.log(err);
                        })
                    }
                }
            })
        }
    })
})
function processtokens(rawtokens) {
    var promise = new Promise((resolve, reject) => {
        var processedtokens = []
        for (var token in rawtokens) {
            processedtokens.push(rawtokens[token]);
        }
        resolve(processedtokens);
    })
    return promise;

}
