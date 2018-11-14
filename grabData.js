var admin = require("firebase-admin");
var fs = require("fs");
var schedule = require('node-schedule');

var serviceAccount = require("./accountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

db.settings({ timestampsInSnapshots: true });


db.collection("entries").orderBy("timestamp", "desc").limit(720).get().then(querySnapshot => {
  let data = querySnapshot.docs;

  data = data.map(dataPoint => dataPoint.data());

  let str = "window.vsIssueTrackerDataPoints = " + JSON.stringify(data);

  fs.writeFile("./data.js", str, (error) => {
      if (error) {
        console.error(error);
        return;
      };
  });
  console.log(str);
});
