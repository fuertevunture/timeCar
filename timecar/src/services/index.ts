import webMan from "@/services/request.ts";

const checkExistRequest = async (userInfo:any) => {
    return await webMan.get('/users/exist',{
        params:{
            userInfo:userInfo
        }
    })
}

const getAllRequest = async () => {
    return await webMan.get('/all',{
        params: {
            no: "21"
        }
    });
}

export {checkExistRequest,getAllRequest};