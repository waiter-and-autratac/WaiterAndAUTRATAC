const __w = async (call)=>{
    return new Promise(async (resolve) => {
       let isTesting = false;
        const tf = async ()=>{
            if(!isTesting){
                isTesting = true;
                try{
                    resolve(await call());
                    observer.disconnect();
                    isTesting=false;
                }catch(e){
                    isTesting=false;
                }
            } 
        }
        const observer = new MutationObserver(tf);
        tf();
       observer.observe(document.documentElement, { attributes: true, childList: true,subtree: true });
    });
}