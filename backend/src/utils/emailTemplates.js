const baseStyles = `
  font-family: Arial, sans-serif;
  color: #333333;
  line-height: 1.5;
`;

function wrapTemplate({ title, body }) {
  return `
    <div style="${baseStyles} padding: 16px;">
      <h2 style="color: #1e88e5;">${title}</h2>
      ${body}
      <p style="margin-top: 24px; font-size: 12px; color: #777;">
        This is an automated message from the Campus Connect Platform.
      </p>
    </div>
  `;
}

function membershipApprovedEmail(userName, clubName) {
  return wrapTemplate({
    title: 'Membership Approved',
    body: `
      <p>Hi ${userName},</p>
      <p>Great news! Your membership request for the <strong>${clubName}</strong> club has been <strong>approved</strong>.</p>
      <p>You can now participate in all club activities and receive updates.</p>
      <p>Welcome aboard!</p>
    `,
  });
}

function membershipRejectedEmail(userName, clubName) {
  return wrapTemplate({
    title: 'Membership Update',
    body: `
      <p>Hi ${userName},</p>
      <p>We wanted to let you know that your membership request for the <strong>${clubName}</strong> club was <strong>rejected</strong>.</p>
      <p>If you believe this was a mistake or would like more information, please contact the club administrators.</p>
      <p>Thank you for your interest.</p>
    `,
  });
}

function newEventNotificationEmail(userName, eventTitle, eventDate, eventDescription, clubName) {
  return wrapTemplate({
    title: `New Event: ${eventTitle}`,
    body: `
      <p>Hi ${userName},</p>
      <p>A new event has been scheduled for the <strong>${clubName}</strong> club:</p>
      <ul>
        <li><strong>Event:</strong> ${eventTitle}</li>
        <li><strong>Date:</strong> ${eventDate ? new Date(eventDate).toLocaleString() : 'TBA'}</li>
      </ul>
      <p>${eventDescription || 'Details coming soon.'}</p>
      <p>We hope to see you there!</p>
    `,
  });
}

function eventRegistrationConfirmationEmail(userName, eventTitle, eventDate) {
  return wrapTemplate({
    title: 'Event Registration Confirmed',
    body: `
      <p>Hi ${userName},</p>
      <p>Your registration for <strong>${eventTitle}</strong> has been confirmed.</p>
      <ul>
        <li><strong>Date:</strong> ${eventDate ? new Date(eventDate).toLocaleString() : 'TBA'}</li>
      </ul>
      <p>Thank you for registering. We look forward to your participation!</p>
    `,
  });
}

module.exports = {
  membershipApprovedEmail,
  membershipRejectedEmail,
  newEventNotificationEmail,
  eventRegistrationConfirmationEmail,
};

