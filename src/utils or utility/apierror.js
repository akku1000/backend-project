class Apierror extends Error{  // file of api error ,error comes like this
    constructor(
        statusCode,
        message="something went wrong",
        error=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false
        this.errors=error

        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {Apierror}