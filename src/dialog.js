// This is the definition of our Dialog
// TODO: Rather than asking the user to fill in their name,
// can you determine their name programatically?
// Give https://api.slack.com/methods/users.info
const fields = {
  NAME: 'full-name',
  COUNT: 'guest-count',
  DIET: 'dietary-req',
  DAY: 'weekday'
};

const dialogForm = (triggerId) => {

  const form = {
    trigger_id: triggerId,
    dialog: JSON.stringify({
      title: 'Welcome!',
      callback_id: 'welcome',
      submit_label: 'Submit',
      elements: [
        {
          label: 'Full name',
          type: 'text',
          name: fields.NAME,
          hint: 'First and last name, please',
        },
        {
          label: 'Number of party guests',
          type: 'text',
          name: fields.COUNT,
          hint: 'How many guests including yourself will come?',
        },
        {
          label: 'Dietary requirements',
          type: 'textarea',
          name: fields.DIET,
          hint: 'Do you have any dietary requirements or preferences (vegan, vegetarian)?',
        },
        {
          label: 'Select weekday for party',
          type: 'select',
          name: fields.DAY,
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

module.exports = {
  dialogForm,
  fields,
}
