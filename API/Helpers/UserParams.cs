using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class UserParams
    {
        // Here we need to speficy the most amount of things that a request can return
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1; // We will take the oage number from the user

        private int _pageSize = 10; //  This is our default size;


        public int PageSize 
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; // we make the comparison here, if the pageSize  is greate or less that MaxPageSize
        }

        public string CurrentUsername { get; set; }
        public string Gender { get; set; }

        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 150; 

        public string OrderBy { get; set; } = "lastActive";
    }
}