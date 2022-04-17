// This is the definition of our Dialog
// TODO: Rather than asking the user to fill in their name,
// can you determine their name programatically?
// Give https://api.slack.com/methods/users.info
module.exports = (triggerId) => {
  const form = {
    trigger_id: triggerId,
    dialog: JSON.stringify({
      title: 'Welcome and thank you for helping us to plan the best party ever!',
      callback_id: 'welcome',
      submit_label: 'Submit',
      elements: [
        {
          label: 'Full name',
          type: 'text',
          name: 'full-name',
          hint: 'First and last name, please',
        },
        {
          label: 'Number of party guests',
          type: 'integer',
          name: 'guest-count',
          hint: 'How many guests including yourself will come?',
        },
        {
          label: 'Dietary requirements',
          type: 'textarea',
          name: 'dietary-req',
          hint: 'Do you have any dietary requirements or preferences (vegan, vegetarian)?',
        },
        {
          label: 'Availability',
          type: 'textarea',
          name: 'availability',
          hint: 'Which dates in the upcoming two weeks suit you best?',
        },
        {
          label: 'Select weekday for party',
          type: 'select',
          name: 'weekday',
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
          hint: 'Which day of the week suits you best to attend the party?',
        },
      ],
    }),
  };

  return form;
};
