using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Message
    {
     public int Id { get; set; }

        // This properties define the relation between AppUser and the Messages

        // Peoperties for the sender
     public int SenderId { get; set; }
     public string SenderUsername { get; set; }

     public AppUser Sender { get; set; }

     // properties for the Receiver

     public int RecipientId { get; set; }
     public string RecipientUsername { get; set; }

     public AppUser Recipient { get; set; }

     // Some specific properties for the message

     public string Content { get; set; }

     public DateTime? DateRead { get; set; }

     public DateTime MessageSend { get; set; } = DateTime.Now;

     public bool SenderDeleted { get; set; }
     public bool  RecipientDeleted { get; set; }
    }
}