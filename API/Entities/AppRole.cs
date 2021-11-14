using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppRole : IdentityRole<int>
    {
        // We can create here a collection after we create the AppUserRole.cs class

        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}