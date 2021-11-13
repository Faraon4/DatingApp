using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MessageRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
            
        }
        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            // if we want to have access to related entities , like sender or Recipient
            // we neeed to project or to eagerly load the related entities

            return await _context.Messages
                            .Include(u => u.Sender)
                            .Include(u => u.Recipient)
                            .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            //We want to create an queriable
            var query = _context.Messages
                        .OrderByDescending(m => m.MessageSend) // by recent message
                        .AsQueryable();
            //Check the container
            query = messageParams.Container switch 
                    {
                        "Inbox" => query.Where(u => u.Recipient.UserName== messageParams.Username && u.RecipientDeleted == false), // u.recipientDeleted == false , we return the mesages that recipient did not delete
                        "Outbox" => query.Where(u => u.Sender.UserName == messageParams.Username && u.SenderDeleted == false), // the same as previous
                         _ => query.Where(u => u.Recipient.UserName== messageParams.Username && u.RecipientDeleted == false && u.DateRead ==null)
                    };

            //Return Dto from this, that's why we need to return the automapper
      
            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        // In this method we plan to get the conversasion between the 2 users
        // and as well to mark unread messages to read  messages

        // We need to take the messages in the memory
        // than do something with them
        // and then to map them to a dto


        // We need to do:
        // 1. Execute the request and get them out to a list
        // 2. Work with the messages inside the memory here

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            // This is the first part, we get the conversation between 2 users
            var messages = await _context.Messages
                                  .Include(u => u.Sender).ThenInclude(p => p.Photos)
                                  .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                                  .Where(m => m.Recipient.UserName == currentUsername && m.RecipientDeleted == false
                                  && m.Sender.UserName == recipientUsername
                                  || m.Recipient.UserName == recipientUsername
                                  && m.Sender.UserName == currentUsername && m.SenderDeleted == false)
                                  .OrderBy(m => m.MessageSend)
                                  .ToListAsync();

            // Check if there are unread messaged
          var unreadMessages = messages.Where(m => m.DateRead == null && m.Recipient.UserName == currentUsername)
                                       .ToList();


            // Then we mark them as read
         if(unreadMessages.Any())
         {
             foreach(var message in unreadMessages)
             {
                 message.DateRead = DateTime.Now;
             }

             await _context.SaveChangesAsync();
         }

          // return the message DTOs
         return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}