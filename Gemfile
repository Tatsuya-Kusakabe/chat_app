#
# 'gem' should not be installed globally
# ** https://leico.github.io/TechnicalNote/Jekyll/worth-bundle-install
#
# 'gem' should be installed in 'vendor/bundle'
# ** https://www.sejuku.net/blog/8178
#
source 'https://rubygems.org'
#
gem 'rails', '4.2.8'
gem 'haml-rails'
gem 'erb2haml'
gem "browserify-rails"
gem 'sprockets-es6'
gem 'react-rails'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.1.0'
gem 'jquery-rails'
gem 'jbuilder', '~> 2.0'
gem 'sdoc', '~> 0.4.0', group: :doc
#
gem 'devise'
gem 'bcrypt'
#
group :development, :test do
  #
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  #
  gem 'byebug'
  #
  gem 'sqlite3'
  #
end
#
group :development do
  #
  # Access an IRB console on exception pages or by using <%= console %> in views
  #
  gem 'web-console', '~> 2.0'
  #
  # Spring speeds up development by keeping your application running in the background.
  # ** https://github.com/rails/spring
  #
  gem 'spring'
  #
end
#
group :production do
  #
  # Using 'postgress' instead of 'sqlite3' for prduction
  # ** https://github.com/rails/rails/issues/31673
  #
  # ** 'brew install postgresql' should be run before 'bundle install'
  # ** https://qiita.com/masanarih0ri/items/5ad2f7e11c8c94170d6b
  #
  gem 'pg', '0.21.0'
  #
end
