import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  message,
}) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <h4>Email, {email}</h4>
    <p>{message}</p>
  </div>
);
