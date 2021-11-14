using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUserRole : IdentityUserRole<int>
    {
       // WE will specify the join entities that we need 
       // Basically, here we specify the possible roles available in our app
       // And this will be many-to-many
       // because one user can have multiple roles
       // and one role can have multiple users


       // This is acting like a join table between the AppUser and AppRole

        public AppUser User { get; set; }
        public AppRole Role { get; set; }

    }
}