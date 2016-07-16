require_relative 'boot'

require "rails"

require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "sprockets/railtie"

Bundler.require(*Rails.groups)

module Handle
  class Application < Rails::Application
    config.time_zone = 'Tokyo'
    # config.api_only = true
    config.debug_exception_response_format = :api
  end
end
