// This is the definition of our Dialog
// TODO: Rather than asking the user to fill in their name,
// can you determine their name programatically?
// Give https://api.slack.com/methods/users.info
module.exports = (triggerId) => {
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
          name: 'full-name',
          hint: 'First and last name, please',
        },
        {
          label: 'Fun fact about yourself',
          type: 'textarea',
          name: 'fun-fact',
          hint: 'Tell us something no one knows!',
        },
        {
          label: 'T-shirt size',
          type: 'select',
          name: 'shirt-size',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
          hint: 'Everybody loves a free t-shirt!',
        },
      ],
    }),
  };

  return form;
};
