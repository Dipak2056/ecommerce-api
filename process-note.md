# user registration process

receive user data from front end
server side validating
if not valid
response wuth unvalid message
else
encrypt password
store in the db
create uniq url for email address validation and send that uniq url to client email

- once client receive the email they will follow the link that should redirect the to our front end page where we get the uniq key part of the url and calll server to verify the code
  inserver:
  receive the uniq email validating code
  check if the cide is valid and exist in database
  if not
  respond s invalid request message
  if exist
  update user status from inactive ti active in the database
  send email confirmation to the user and get that
