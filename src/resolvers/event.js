import formatErrors from '../formatErrors';

export default {
  Query: {
    getEvent: (parent, { id }, { models }) => {
      return models.event.findOne({ where: { id } });
    },
    getEvents: (parent, args, { models }) => {
      return models.event.findAll();
    },
  },
  Mutation: {
    createEvent: (parent, args, { models }) => {
      return models.event.create(args);
    },
    addVolunteer: async (parent, { username, eventId }, { models }) => {
      try {
        const volunteer = await models.volunteer.findOne({
          where: { username },
        });
        const eventVolunteer = await models.eventVolunteer.create({
          volunteerId: volunteer.id,
          eventId: eventId,
        });
        if (!eventVolunteer) {
          return {
            ok: false,
            errors: [{ path: 'username', message: 'bad things' }],
          };
        }
        return {
          ok: true,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },
  },
  //custom event resolver
  Event: {
    //within an event query if there is a request for the nonprofit field it will hit this resolver
    nonprofit: async ({ id }, args, { models }) => {
      const event = await models.event.findOne({ where: id });
      return await models.nonprofit.findOne({
        where: { id: event.nonprofitId },
      });
    },
    //within an event query if there is a request for the volunteer field it will hit this resolver
    volunteers: async ({ id }, args, { models }) => {
      const event = await models.event.findOne({ where: id });
      const eventVolunteers = await models.eventVolunteer.findAll({
        where: { eventId: event.id },
      });
      return eventVolunteers.map((eventVolunteer) => {
        return models.volunteer.findOne({
          where: { id: eventVolunteer.volunteerId },
        });
      });
    },
  },
};
