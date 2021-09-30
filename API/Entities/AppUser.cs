using System;
using System.Collections.Generic;
using API.Extensions;

namespace API.Entities
{
    public class AppUser
    {
        public int Id { get; set; }
        public string UserName { get; set; }

        public byte[] PasswordHash{get;set;}
        public byte[] PasswordSalt {get;set;}
        
     public DateTime DateOfBirth { get; set; }
     public string KnownAs { get; set; }
     public DateTime Created { get; set; } = DateTime.Now;
     public DateTime Active {get;set;} = DateTime.Now;
     public string Gender { get; set; }
     public string Introduction { get; set; }
     public string LookingFor {get;set;}
     public string Interests {get;set;}
     public string City { get; set; }
     public string Country {get;set;}
     // This type of relation is called one to many 
     // So one user can have multiple photos
     // For this we need to announce the photos class as well about this
     // Look at the Photo class and new add AppUser property
     public ICollection<Photo> Photos {get;set;}


     public int GetAge()
     {
         return DateOfBirth.CalculateAge();
     }

    }
}