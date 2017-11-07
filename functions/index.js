const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

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
