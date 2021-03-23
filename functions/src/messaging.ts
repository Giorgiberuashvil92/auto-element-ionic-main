import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

export const sendPush = functions.https.onRequest(async (request, response) => {

    const req = request.body;

    function array_chunk(input:Array<any>, size:number) {
        for(var x, i = 0, c = -1, l = input.length, n = []; i < l; i++){
            (x = i % size) ? n[c][x] = input[i] : n[++c] = [input[i]];
        }
        return n;
    }

    async function asyncForEach(array:any, callback:any) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    const tokens = array_chunk(req.tokens, 100);

    await asyncForEach(tokens, async (tokensDevice:Array<string>) => {
        let message = {
            notification: {
                title: req.title,
                body: req.body,
            },
            android: {
                notification: {
                    notificationCount: 0,
                    sound: "default",
                    defaultVibrateTimings: true,
                    defaultSound: true,
                    defaultLightSettings: true,
                }
            },
            apns: {
                payload: {
                    aps: {
                        badge: 0,
                        sound: "default"
                    }
                }
            },
            data: req.data,
            tokens: tokensDevice,
        };
        console.log(message);
        const res = await admin.messaging().sendMulticast(message);
        let result = res.responses.map((el:any)=>
            el.success ? true : el.error.message
        );
        console.log(result);
    });

    await response.send("Ok");

});
