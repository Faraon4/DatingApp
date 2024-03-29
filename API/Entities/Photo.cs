using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Photos")]
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }

        // We add the new AppUser property in order to inform 
        // this class where to add photos
        // And this is know as furly defining the relationship between 2 entities
        // In our case is the AppUser and Photo
        public AppUser AppUser { get; set; }
        public int AppUserId {get;set;} 
    }
}