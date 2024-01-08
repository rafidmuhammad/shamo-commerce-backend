class ResponseFormat{
    static success({message =null, data = null}){
        let res = {
            'meta':{
                'code' : 200,
                'status' : 'success',
                'message' : message
            },
            'data':data
        };
        return res;
    }

    static notFound({code = 404,message =null, data = null}){
        let res = {
            'meta':{
                'code' : code,
                'status' : 'failed',
                'message' : message
            },
            'data':data
        };
        return res;
    }
}

module.exports = ResponseFormat;