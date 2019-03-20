
# Responsible for overridden method of 'Devise::Mailer'
class Users::Mailer < Devise::Mailer

  # ** A default 'mailer.rb' is described below
  # ** https://github.com/plataformatec/devise/blob/master/app/mailers/devise/mailer.rb

  # ** A default 'mailers/helpers.rb' is described below
  # ** https://github.com/plataformatec/devise/blob/master/lib/devise/mailers/helpers.rb

  # ** A default 'class' responsible for sending emails
  #    and a default 'parameter' 'from' are defined in 'config/initializers/devise.rb'

  # Defining a default 'template_path'
  default template_path: 'users/mailer'

  # Overriding 'confirmation_instructions'
  def confirmation_instructions(record, token, opts = {})
    super
  end

  # Overriding 'reset_password_instructions'
  def reset_password_instructions(record, token, opts = {})
    super
  end

  # Overriding 'password_change'
  def reset_password_completions(record, opts = {})
    devise_mail(record, :reset_password_completions, opts)
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #   en.user_mailer.test.subject

end
