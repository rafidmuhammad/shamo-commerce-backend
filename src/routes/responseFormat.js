class ResponseFormat{
    static success({messageText =null, dataOut = null}){
        let res = {
            meta:{
                code : 200,
                status : 'success',
                message : messageText
            },
            data : dataOut
        };
        return res;
    }

    static error({code = 404,messageText =null, dataOut = null}){
        let res = {
            meta:{
                code : code,
                status : 'failed',
                message : messageText
            },
            data : dataOut
        };
        return res;
    }
}

module.exports = ResponseFormat;