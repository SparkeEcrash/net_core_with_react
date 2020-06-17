using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ActivitiesController : ControllerBase
	{
		private readonly IMediator _mediator;
		public ActivitiesController(IMediator mediator)
		{
			_mediator = mediator;
		}

		//Names of Functions "List, Details, Create, and Edit" are classes in Application-->Activities folder

		[HttpGet]
		//Task<ActionResult<List<Activity>>> is returned from List() because it is a public async function
		public async Task<ActionResult<List<Activity>>> List(CancellationToken ct)
		{
			return await _mediator.Send(new List.Query(), ct);
			//passed in paramter in _mediator.Send passed to line 26 in List.cs *Handle() {}*
		}

		//Task<ActionResult<Activity>> is returned from Details because it is a public async function
		[HttpGet("{id}")]
		public async Task<ActionResult<Activity>> Details(Guid id)
		{
			return await _mediator.Send(new Details.Query { ActivityId = id });
			//passed in paramter in _mediator.Send passed to line 24 in Details.cs *Handle() {}*
		}

		//Task<ActionResult<Unit>> is returned from Create because it is a public async function
		[HttpPost]
		public async Task<ActionResult<Unit>> Create(Create.CommandObject command)
		//command is data sent in body of the post request and Create.CommandObject is cast onto it
		{
			return await _mediator.Send(command);
			//passed in paramters in _mediator.Send passed to line 30 in Create.cs *Handle() {}*
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<Unit>> Edit(Guid id, Edit.CommandObject command)
		//command is data sent in body of the post request and Create.CommandObject is cast onto it
		{
			command.Id = id;
			return await _mediator.Send(command);
			//passed in paramters in _mediator.Send passed to line 30 in Create.cs *Handle() {}*
		}

		[HttpDelete("{id}")]
		public async Task<ActionResult<Unit>> Delete(Guid id)
		{
			return await _mediator.Send(new Delete.CommandObject { Id = id });
		}
	}
}