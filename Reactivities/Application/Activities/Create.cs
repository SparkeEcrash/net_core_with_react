using System;
using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
	public class Create
	{
		public class CommandObject : IRequest
		{
			public Guid Id { get; set; }

			[Required]
			public string Title { get; set; }
			public string Description { get; set; }
			public string Category { get; set; }
			public DateTime Date { get; set; }
			public string City { get; set; }
			public string Venue { get; set; }
		}

		public class CommandValidator : AbstractValidator<CommandObject>
		{
			public CommandValidator()
			{
				RuleFor(x => x.Title).NotEmpty();
			}
		}
		public class Handler : IRequestHandler<CommandObject>
		{
			private readonly DataContext _context;
			//https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-3.1
			//the "DataContext" dependency injection which creates "context" is registered in Startup.cs line 25
			public Handler(DataContext context)
			{
				_context = context;
			}

			public async Task<Unit> Handle(CommandObject request, CancellationToken cancellationToken)
			{
				var activity = new Activity
				{
					Id = request.Id,
					Title = request.Title,
					Description = request.Description,
					Category = request.Category,
					Date = request.Date,
					City = request.City,
					Venue = request.Venue
				};
				_context.Activities.Add(activity);
				//SaveChangesAsync returns number of changes made and needs to be greater than 0 to be successful
				var success = await _context.SaveChangesAsync() > 0;

				if (success) return Unit.Value; //200 OK response
				throw new Exception("Problem saving changes"); // if it fails
			}
		}
	}
}

/*
public class CommandObject : IRequest
{
	public Guid Id { get; set; }
	public string Title { get; set; }
	public string Description { get; set; }
	public string Category { get; set; }
	public DateTime Date { get; set; }
	public string City { get; set; }
	public string Venue { get; set; }
}
public class Handler : IRequestHandler<CommandObject>
{
	private readonly DataContext _context;
	public Handler(DataContext context)
	{
		_context = context;
	}

	public async Task<Unit> Handle(CommandObject request, CancellationToken cancellationToken)
	{
		var activity = new Activity
		{
			Id = request.Id,
			Title = request.Title,
			Description = request.Description,
			Category = request.Category,
			Date = request.Date,
			City = request.City,
			Venue = request.Venue
		};
		_context.Activities.Add(activity);
		var success = await _context.SaveChangesAsync() > 0;

		if (success) return Unit.Value; //200 OK response
		throw new Exception("Problem saving changes"); // if it fails
	}
}
*/