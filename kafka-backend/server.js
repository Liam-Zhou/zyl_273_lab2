var connection =  new require('./kafka/Connection');
//topics files
//var signin = require('./services/signin.js');
let Login = require('./services/login');
let Job = require('./services/job');
let Profile = require('./services/profile');
let Event = require('./services/event')

//mongo connection
const { mongoDB } = require('./config/mongoConfig');
const mongoose = require('mongoose');

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 500,
    bufferMaxEntries: 0
};

mongoose.connect(mongoDB, options, (err, res) => {
    if (err) {
        console.log(err);
        console.log(`MongoDB Connection Failed`);
    } else {
        console.log(`MongoDB Connected`);
    }
});


function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log(topic_name+' is running ');
    consumer.on('message', function (message) {
        console.log('message',message)
        console.log('message received for ' + topic_name +" ", fname);
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("login",Login)
handleTopicRequest("job",Job)
handleTopicRequest("profile",Profile)
handleTopicRequest("event",Event)