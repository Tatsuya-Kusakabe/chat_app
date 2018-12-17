
# 'gem' should not be installed globally
# ** https://leico.github.io/TechnicalNote/Jekyll/worth-bundle-install

# 'gem' should be installed in 'vendor/bundle'
# ** https://www.sejuku.net/blog/8178

# 'heroku buildpacks:add ...' should be executed before 'git push heroku'
# ** flux_tutorial⁩/vendor/⁨bundle/⁨ruby/⁨2.5.0/⁨gems/⁨browserify-rails-4.3.0⁩/README.md
# ** https://qiita.com/yuya_takeyama/items/fdb18999a22b5ad2663b

# 'Ruby' version should be declared inside 'Gemfile'
ruby '2.5.0'

source 'https://rubygems.org'

gem "browserify-rails"

gem 'rails', '4.2.8'
gem 'haml-rails'
gem 'erb2haml'
gem 'sprockets-es6'
gem 'react-rails'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.1.0'
gem 'jquery-rails'
gem 'jbuilder', '~> 2.0'
gem 'sdoc', '~> 0.4.0', group: :doc

gem 'devise'
gem 'bcrypt'

group :development, :test do

  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'

  gem 'sqlite3'

end
#
group :development do

  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

  # Spring speeds up development by keeping your application running in the background.
  # ** https://github.com/rails/spring
  gem 'spring'

  # Rubocop automatically checks code styles
  gem 'rubocop', '~> 0.60.0'

end

group :production do

  # Using 'postgress' instead of 'sqlite3' for prduction
  # ** https://github.com/rails/rails/issues/31673

  # ** 'brew install postgresql' should be run before 'bundle install'
  # ** 'BUNDLE_WITHOUT: "production"' should be removed from '.bundle/config'
  # ** https://qiita.com/masanarih0ri/items/5ad2f7e11c8c94170d6b

  # ** Downgrading to 'pg 0.20' to remove error messages
  # ** https://github.com/rails/rails/issues/29521
  gem 'pg', '0.20'

  # 'rails_12factor' is necessary for activating 'Rails' on 'Heroku'
  # ** https://qiita.com/yuku_t/items/8fd7551dc0418bf59aae
  gem 'rails_12factor'
  
end
