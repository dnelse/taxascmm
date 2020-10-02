const moongoose=require('mongoose');


//moongoose.set('useNewUrlParser', true);
//mongoose.connect(uri, { useNewUrlParser: true });



moongoose.connect("mongodb://localhost:27017/cmm_db",{ useNewUrlParser: true ,useUnifiedTopology: true,useFindAndModify:false},(error=>{
    if(!error){
console.log("Connected");

    }
    else{
        console.log("Fail");
    }

}))
