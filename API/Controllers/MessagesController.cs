using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        public MessagesController(IUserRepository userRepository,
        IMessageRepository messageRepository, IMapper mapper)
        {
            _mapper = mapper;
            _messageRepository = messageRepository;
            _userRepository = userRepository;
            
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var username = User.GetUsername();
        
            // Check if username = to recipinet name to createMessDto
            if (username == createMessageDto.RecipientUsername.ToLower())
            {
                return BadRequest("You cannot send messages to yourself");
            }

            var sender = await _userRepository.GetUserByUsernameAsync(username); 
            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            // if do not have recipient

            if(recipient == null) return NotFound(); 

            // If we get to this stage, we are ready to create a new message

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

                _messageRepository.AddMessage(message);

                if(await _messageRepository.SaveAllAsync()) return Ok(_mapper.Map<MessageDto>(message));
        
            return BadRequest("Failed to send message");
        }   



        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();

            var messages = await _messageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);

            return messages;
        }


        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        {
            var currentUsername = User.GetUsername();

            return Ok(await _messageRepository.GetMessageThread(currentUsername, username));
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();

            var message = await _messageRepository.GetMessage(id);

         // If the either the senderUsername or the recipientUsername
         // is not equal with username
         // than this message has nothing to do

            if(message.Sender.UserName != username && message.Recipient.UserName != username)
            return Unauthorized();

            // check id the senderUsername is equal to the username
            // if it is true that deleted is true

            if(message.SenderUsername == username) 
            message.SenderDeleted = true;


            // previous with the recipeient

            if(message.Recipient.UserName == username)
             message.RecipientDeleted = true;


            // check if both sender and recipient deletted the message

            if (message.SenderDeleted && message.RecipientDeleted)
            _messageRepository.DeleteMessage(message);



            if(await _messageRepository.SaveAllAsync())
             return Ok();


            return BadRequest("Problem deleting the message");
        }
    }
}