import app from "./app.js"
import { PORT } from "./configs/env.js";
function run(){
    app.listen(PORT, ()=>{
        console.log(`User service running on Port: ${PORT}`);
        
    })
}

run()