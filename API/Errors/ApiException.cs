using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Errors
{
    public class ApiException
    {
        public ApiException(int statucCode, string message = null, string details = null)
        {
            StatucCode = statucCode;
            Message = message;
            Details = details;
        }

        public int StatucCode {get;set;}
        public string Message{get;set;}
        public string Details {get;set;}
    }
}