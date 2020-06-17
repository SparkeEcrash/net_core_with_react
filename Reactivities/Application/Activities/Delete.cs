using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities
{
	public class Delete
	{
		public class CommandObject : IRequest
		{
			public Guid Id { get; set; }
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
				if (activity == null)
					throw new Exception("Could not find activity");

				_context.Remove(activity); 
				
				var success = await _context.SaveChangesAsync() > 0;

				if (success) return Unit.Value; //200 OK response
				throw new Exception("Problem saving changes"); // if it fails
			}
		}
	}
}