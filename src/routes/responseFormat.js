class ResponseFormat{
    static success({code=200,messageText =null, dataOut = null}){
        let res = {
            meta:{
                code : code,
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