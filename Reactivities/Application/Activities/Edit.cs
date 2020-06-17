using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities
{
	public class Edit
	{
		public class CommandObject : IRequest
		{
        public Guid Id { get; set; }
				public string Title { get; set; }
				public string Description { get; set; }
				public string Category { get; set; }
				
				// "?" means that this property is optional
				public DateTime? Date { get; set; }
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
				var activity = await _context.Activities.FindAsync(request.Id);
				if (activity == null) throw new Exception("Could not find activity");

				// if request.Title is null... then anything after "??" is going to run
				activity.Title = request.Title ?? activity.Title;
				activity.Description = request.Description ?? activity.Description;
				activity.Category = request.Category ?? activity.Category;
				activity.Date = request.Date ?? activity.Date;
				activity.City = request.City ?? activity.City;
				activity.Venue = request.Venue ?? activity.Venue;

				var success = await _context.SaveChangesAsync() > 0;

				if (success) return Unit.Value; //200 OK response
				throw new Exception("Problem saving changes"); // if it fails
			}
		}
	}
}