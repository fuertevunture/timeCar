import webMan from "@/services/request.ts";

const checkExistRequest = async (userInfo:any) => {
    return await webMan.get('/users/exist',{
        params:{
            userInfo:userInfo
        }
    })
}

const getAllRequest = async (no:string) => {
    return await webMan.get('/all',{
        params: {
            no: no
        }
    });
}

export {checkExistRequest,getAllRequest};